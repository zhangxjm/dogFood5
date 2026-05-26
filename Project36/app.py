from flask import Flask, render_template, request, jsonify
from datetime import datetime
from config import Config
from models import db, ParkingSlot, ParkingRecord
from init_db import init_slots

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

HOURLY_RATE = 5.0


def create_app():
    with app.app_context():
        db.create_all()
        init_slots()
    return app


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/stats', methods=['GET'])
def get_stats():
    total = ParkingSlot.query.count()
    occupied = ParkingSlot.query.filter_by(status='occupied').count()
    available = total - occupied
    return jsonify({
        'total': total,
        'occupied': occupied,
        'available': available
    })


@app.route('/api/slots', methods=['GET'])
def get_slots():
    status_filter = request.args.get('status')
    if status_filter:
        slots = ParkingSlot.query.filter_by(status=status_filter).all()
    else:
        slots = ParkingSlot.query.all()
    return jsonify([s.to_dict() for s in slots])


@app.route('/api/entry', methods=['POST'])
def vehicle_entry():
    data = request.get_json()
    plate_number = data.get('plate_number', '').strip().upper()

    if not plate_number:
        return jsonify({'success': False, 'message': 'Plate number is required'}), 400

    existing = ParkingSlot.query.filter_by(plate_number=plate_number, status='occupied').first()
    if existing:
        return jsonify({'success': False, 'message': 'Vehicle already parked'}), 400

    slot = ParkingSlot.query.filter_by(status='available').order_by(ParkingSlot.slot_number).first()
    if not slot:
        return jsonify({'success': False, 'message': 'No available slots'}), 400

    slot.status = 'occupied'
    slot.plate_number = plate_number
    slot.entry_time = datetime.now()

    record = ParkingRecord(
        plate_number=plate_number,
        slot_number=slot.slot_number,
        entry_time=slot.entry_time
    )

    db.session.add(record)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': f'Vehicle parked at {slot.slot_number}',
        'slot': slot.to_dict()
    })


@app.route('/api/exit', methods=['POST'])
def vehicle_exit():
    data = request.get_json()
    plate_number = data.get('plate_number', '').strip().upper()

    if not plate_number:
        return jsonify({'success': False, 'message': 'Plate number is required'}), 400

    slot = ParkingSlot.query.filter_by(plate_number=plate_number, status='occupied').first()
    if not slot:
        return jsonify({'success': False, 'message': 'Vehicle not found'}), 404

    exit_time = datetime.now()
    entry_time = slot.entry_time
    duration_hours = (exit_time - entry_time).total_seconds() / 3600
    fee = round(duration_hours * HOURLY_RATE, 2)

    slot.status = 'available'
    slot.plate_number = None
    slot.entry_time = None

    record = ParkingRecord.query.filter_by(
        plate_number=plate_number,
        slot_number=slot.slot_number,
        exit_time=None
    ).first()

    if record:
        record.exit_time = exit_time
        record.duration = duration_hours
        record.fee = fee

    db.session.commit()

    return jsonify({
        'success': True,
        'message': f'Vehicle exited. Fee: {fee} CNY',
        'plate_number': plate_number,
        'slot_number': slot.slot_number,
        'entry_time': entry_time.strftime('%Y-%m-%d %H:%M:%S'),
        'exit_time': exit_time.strftime('%Y-%m-%d %H:%M:%S'),
        'duration_hours': round(duration_hours, 2),
        'fee': fee
    })


@app.route('/api/records', methods=['GET'])
def get_records():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    records = ParkingRecord.query.order_by(ParkingRecord.entry_time.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    return jsonify({
        'records': [r.to_dict() for r in records.items],
        'total': records.total,
        'page': page,
        'per_page': per_page
    })


@app.route('/api/duration-stats', methods=['GET'])
def duration_stats():
    records = ParkingRecord.query.filter(ParkingRecord.exit_time.isnot(None)).all()
    if not records:
        return jsonify({
            'total_vehicles': 0,
            'avg_duration': 0,
            'total_fee': 0,
            'max_duration': 0,
            'min_duration': 0
        })

    durations = [r.duration for r in records if r.duration]
    fees = [r.fee for r in records if r.fee]

    return jsonify({
        'total_vehicles': len(records),
        'avg_duration': round(sum(durations) / len(durations), 2) if durations else 0,
        'total_fee': round(sum(fees), 2) if fees else 0,
        'max_duration': round(max(durations), 2) if durations else 0,
        'min_duration': round(min(durations), 2) if durations else 0
    })


if __name__ == '__main__':
    create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
