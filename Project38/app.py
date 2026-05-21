from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///parking.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['TOTAL_SPACES'] = 50

db = SQLAlchemy(app)

class ParkingSpace(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    space_number = db.Column(db.Integer, unique=True, nullable=False)
    is_occupied = db.Column(db.Boolean, default=False)
    car_plate = db.Column(db.String(20))
    entry_time = db.Column(db.DateTime)

class ParkingRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    car_plate = db.Column(db.String(20), nullable=False)
    space_number = db.Column(db.Integer, nullable=False)
    entry_time = db.Column(db.DateTime, nullable=False)
    exit_time = db.Column(db.DateTime)
    duration = db.Column(db.Integer)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/spaces', methods=['GET'])
def get_spaces():
    spaces = ParkingSpace.query.all()
    occupied = ParkingSpace.query.filter_by(is_occupied=True).count()
    total = app.config['TOTAL_SPACES']
    return jsonify({
        'total': total,
        'occupied': occupied,
        'available': total - occupied,
        'spaces': [{
            'id': s.id,
            'space_number': s.space_number,
            'is_occupied': s.is_occupied,
            'car_plate': s.car_plate,
            'entry_time': s.entry_time.strftime('%Y-%m-%d %H:%M:%S') if s.entry_time else None
        } for s in spaces]
    })

@app.route('/api/entry', methods=['POST'])
def car_entry():
    data = request.get_json()
    car_plate = data.get('car_plate')
    
    if not car_plate:
        return jsonify({'success': False, 'message': '车牌号不能为空'})
    
    existing = ParkingSpace.query.filter_by(car_plate=car_plate).first()
    if existing:
        return jsonify({'success': False, 'message': '该车辆已在停车场内'})
    
    space = ParkingSpace.query.filter_by(is_occupied=False).first()
    if not space:
        return jsonify({'success': False, 'message': '没有空余车位'})
    
    space.is_occupied = True
    space.car_plate = car_plate
    space.entry_time = datetime.now()
    
    record = ParkingRecord(
        car_plate=car_plate,
        space_number=space.space_number,
        entry_time=space.entry_time
    )
    db.session.add(record)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': '入场成功',
        'space_number': space.space_number,
        'entry_time': space.entry_time.strftime('%Y-%m-%d %H:%M:%S')
    })

@app.route('/api/exit', methods=['POST'])
def car_exit():
    data = request.get_json()
    car_plate = data.get('car_plate')
    
    if not car_plate:
        return jsonify({'success': False, 'message': '车牌号不能为空'})
    
    space = ParkingSpace.query.filter_by(car_plate=car_plate).first()
    if not space:
        return jsonify({'success': False, 'message': '该车辆不在停车场内'})
    
    exit_time = datetime.now()
    duration = int((exit_time - space.entry_time).total_seconds() / 60)
    
    record = ParkingRecord.query.filter_by(
        car_plate=car_plate,
        exit_time=None
    ).first()
    if record:
        record.exit_time = exit_time
        record.duration = duration
    
    space.is_occupied = False
    space.car_plate = None
    space.entry_time = None
    
    db.session.commit()
    
    hours = duration // 60
    minutes = duration % 60
    
    return jsonify({
        'success': True,
        'message': '离场成功',
        'duration': f'{hours}小时{minutes}分钟',
        'minutes': duration
    })

@app.route('/api/records', methods=['GET'])
def get_records():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    records = ParkingRecord.query.order_by(
        ParkingRecord.entry_time.desc()
    ).paginate(page=page, per_page=per_page)
    
    return jsonify({
        'records': [{
            'id': r.id,
            'car_plate': r.car_plate,
            'space_number': r.space_number,
            'entry_time': r.entry_time.strftime('%Y-%m-%d %H:%M:%S'),
            'exit_time': r.exit_time.strftime('%Y-%m-%d %H:%M:%S') if r.exit_time else None,
            'duration': f'{r.duration // 60}小时{r.duration % 60}分钟' if r.duration else '停车中'
        } for r in records.items],
        'total': records.total,
        'pages': records.pages,
        'current_page': page
    })

@app.route('/api/stats', methods=['GET'])
def get_stats():
    today = datetime.now().date()
    
    today_records = ParkingRecord.query.filter(
        db.func.date(ParkingRecord.entry_time) == today
    ).all()
    
    total_vehicles = len(today_records)
    completed_vehicles = sum(1 for r in today_records if r.duration)
    
    if completed_vehicles > 0:
        avg_duration = sum(r.duration for r in today_records if r.duration) / completed_vehicles
    else:
        avg_duration = 0
    
    currently_parked = ParkingSpace.query.filter_by(is_occupied=True).count()
    
    return jsonify({
        'today_vehicles': total_vehicles,
        'completed_vehicles': completed_vehicles,
        'avg_duration_minutes': round(avg_duration, 1),
        'avg_duration': f'{int(avg_duration // 60)}小时{int(avg_duration % 60)}分钟',
        'currently_parked': currently_parked
    })

def init_spaces():
    if ParkingSpace.query.count() == 0:
        for i in range(1, app.config['TOTAL_SPACES'] + 1):
            space = ParkingSpace(space_number=i)
            db.session.add(space)
        db.session.commit()

with app.app_context():
    db.create_all()
    init_spaces()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
