from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class ParkingSlot(db.Model):
    __tablename__ = 'parking_slots'

    id = db.Column(db.Integer, primary_key=True)
    slot_number = db.Column(db.String(10), unique=True, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='available')
    plate_number = db.Column(db.String(20), nullable=True)
    entry_time = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'slot_number': self.slot_number,
            'status': self.status,
            'plate_number': self.plate_number,
            'entry_time': self.entry_time.strftime('%Y-%m-%d %H:%M:%S') if self.entry_time else None
        }


class ParkingRecord(db.Model):
    __tablename__ = 'parking_records'

    id = db.Column(db.Integer, primary_key=True)
    plate_number = db.Column(db.String(20), nullable=False)
    slot_number = db.Column(db.String(10), nullable=False)
    entry_time = db.Column(db.DateTime, nullable=False)
    exit_time = db.Column(db.DateTime, nullable=True)
    duration = db.Column(db.Float, nullable=True)
    fee = db.Column(db.Float, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'plate_number': self.plate_number,
            'slot_number': self.slot_number,
            'entry_time': self.entry_time.strftime('%Y-%m-%d %H:%M:%S'),
            'exit_time': self.exit_time.strftime('%Y-%m-%d %H:%M:%S') if self.exit_time else None,
            'duration': round(self.duration, 2) if self.duration else None,
            'fee': round(self.fee, 2) if self.fee else None
        }
