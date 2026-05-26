import os
from datetime import datetime, timedelta
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'instance', 'court_reservation.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class Court(db.Model):
    __tablename__ = 'courts'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    type = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(200))
    description = db.Column(db.String(500))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.now)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'location': self.location,
            'description': self.description,
            'is_active': self.is_active
        }


class TimeSlot(db.Model):
    __tablename__ = 'time_slots'
    id = db.Column(db.Integer, primary_key=True)
    start_time = db.Column(db.String(10), nullable=False)
    end_time = db.Column(db.String(10), nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    is_active = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'duration': self.duration
        }


class Reservation(db.Model):
    __tablename__ = 'reservations'
    id = db.Column(db.Integer, primary_key=True)
    court_id = db.Column(db.Integer, db.ForeignKey('courts.id'), nullable=False)
    time_slot_id = db.Column(db.Integer, db.ForeignKey('time_slots.id'), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    user_name = db.Column(db.String(100), nullable=False)
    user_phone = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), default='reserved')
    created_at = db.Column(db.DateTime, default=datetime.now)
    cancelled_at = db.Column(db.DateTime)

    court = db.relationship('Court', backref=db.backref('reservations', lazy=True))
    time_slot = db.relationship('TimeSlot', backref=db.backref('reservations', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'court_id': self.court_id,
            'court_name': self.court.name if self.court else '',
            'time_slot_id': self.time_slot_id,
            'time_range': f"{self.time_slot.start_time}-{self.time_slot.end_time}" if self.time_slot else '',
            'date': self.date,
            'user_name': self.user_name,
            'user_phone': self.user_phone,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else '',
            'cancelled_at': self.cancelled_at.strftime('%Y-%m-%d %H:%M:%S') if self.cancelled_at else ''
        }


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/courts', methods=['GET'])
def get_courts():
    courts = Court.query.filter_by(is_active=True).all()
    result = []
    for c in courts:
        result.append(c.to_dict())
    return jsonify({'code': 200, 'data': result})


@app.route('/api/time_slots', methods=['GET'])
def get_time_slots():
    slots = TimeSlot.query.filter_by(is_active=True).all()
    result = []
    for s in slots:
        result.append(s.to_dict())
    return jsonify({'code': 200, 'data': result})


@app.route('/api/reservations', methods=['GET'])
def get_reservations():
    date = request.args.get('date')
    court_id = request.args.get('court_id')
    query = Reservation.query.filter_by(status='reserved')
    if date:
        query = query.filter_by(date=date)
    if court_id:
        query = query.filter_by(court_id=court_id)
    reservations = query.order_by(Reservation.created_at.desc()).all()
    result = []
    for r in reservations:
        result.append(r.to_dict())
    return jsonify({'code': 200, 'data': result})


@app.route('/api/reserve', methods=['POST'])
def create_reservation():
    data = request.get_json()
    court_id = data.get('court_id')
    time_slot_id = data.get('time_slot_id')
    date = data.get('date')
    user_name = data.get('user_name')
    user_phone = data.get('user_phone')

    if not all([court_id, time_slot_id, date, user_name, user_phone]):
        return jsonify({'code': 400, 'message': 'Please fill in all required fields'}), 400

    existing = Reservation.query.filter_by(
        court_id=court_id,
        time_slot_id=time_slot_id,
        date=date,
        status='reserved'
    ).first()

    if existing:
        return jsonify({'code': 409, 'message': 'This time slot is already reserved'}), 409

    reservation = Reservation(
        court_id=court_id,
        time_slot_id=time_slot_id,
        date=date,
        user_name=user_name,
        user_phone=user_phone
    )
    db.session.add(reservation)
    db.session.commit()

    return jsonify({'code': 200, 'message': 'Reservation successful', 'data': reservation.to_dict()})


@app.route('/api/reservations/<int:reservation_id>/cancel', methods=['POST'])
def cancel_reservation(reservation_id):
    reservation = Reservation.query.get_or_404(reservation_id)
    if reservation.status != 'reserved':
        return jsonify({'code': 400, 'message': 'Reservation status error'}), 400
    reservation.status = 'cancelled'
    reservation.cancelled_at = datetime.now()
    db.session.commit()
    return jsonify({'code': 200, 'message': 'Cancellation successful'})


@app.route('/api/reservations/history', methods=['GET'])
def get_history():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    keyword = request.args.get('keyword', '')
    query = Reservation.query
    if keyword:
        query = query.filter(
            db.or_(
                Reservation.user_name.contains(keyword),
                Reservation.user_phone.contains(keyword)
            )
        )
    reservations = query.order_by(Reservation.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    result = []
    for r in reservations.items:
        result.append(r.to_dict())
    return jsonify({
        'code': 200,
        'data': result,
        'total': reservations.total,
        'pages': reservations.pages,
        'current_page': page
    })


@app.route('/api/available_slots', methods=['GET'])
def get_available_slots():
    date = request.args.get('date')
    court_id = request.args.get('court_id')
    if not date or not court_id:
        return jsonify({'code': 400, 'message': 'Missing parameters'}), 400

    all_slots = TimeSlot.query.filter_by(is_active=True).all()
    reserved = Reservation.query.filter_by(
        court_id=court_id,
        date=date,
        status='reserved'
    ).all()
    reserved_slot_ids = []
    for r in reserved:
        reserved_slot_ids.append(r.time_slot_id)

    available = []
    for slot in all_slots:
        slot_dict = slot.to_dict()
        slot_dict['available'] = slot.id not in reserved_slot_ids
        available.append(slot_dict)

    return jsonify({'code': 200, 'data': available})


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
