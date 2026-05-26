import os
import sys
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, db, Court, TimeSlot


def init_db():
    with app.app_context():
        os.makedirs(os.path.join(os.path.dirname(__file__), 'instance'), exist_ok=True)
        db.create_all()

        if Court.query.count() == 0:
            courts_data = [
                {'name': 'Basketball Court 1', 'type': 'Basketball', 'location': 'Sports Center A, 1st Floor', 'description': 'Standard basketball court, indoor'},
                {'name': 'Basketball Court 2', 'type': 'Basketball', 'location': 'Sports Center A, 1st Floor', 'description': 'Standard basketball court, indoor'},
                {'name': 'Tennis Court 1', 'type': 'Tennis', 'location': 'Outdoor Sports Area', 'description': 'Standard tennis court, outdoor'},
                {'name': 'Tennis Court 2', 'type': 'Tennis', 'location': 'Outdoor Sports Area', 'description': 'Standard tennis court, outdoor'},
                {'name': 'Badminton Court 1', 'type': 'Badminton', 'location': 'Sports Center B, 2nd Floor', 'description': 'Professional badminton court'},
                {'name': 'Badminton Court 2', 'type': 'Badminton', 'location': 'Sports Center B, 2nd Floor', 'description': 'Professional badminton court'},
                {'name': 'Badminton Court 3', 'type': 'Badminton', 'location': 'Sports Center B, 2nd Floor', 'description': 'Professional badminton court'},
                {'name': 'Volleyball Court', 'type': 'Volleyball', 'location': 'Sports Center A, 1st Floor', 'description': 'Standard volleyball court'},
                {'name': 'Table Tennis Room 1', 'type': 'Table Tennis', 'location': 'Sports Center B, 1st Floor', 'description': 'Table tennis tables'},
                {'name': 'Table Tennis Room 2', 'type': 'Table Tennis', 'location': 'Sports Center B, 1st Floor', 'description': 'Table tennis tables'},
            ]
            for c_data in courts_data:
                court = Court(**c_data)
                db.session.add(court)
            db.session.commit()
            print(f"Initialized {len(courts_data)} courts")

        if TimeSlot.query.count() == 0:
            slots_data = [
                {'start_time': '08:00', 'end_time': '09:00', 'duration': 60},
                {'start_time': '09:00', 'end_time': '10:00', 'duration': 60},
                {'start_time': '10:00', 'end_time': '11:00', 'duration': 60},
                {'start_time': '11:00', 'end_time': '12:00', 'duration': 60},
                {'start_time': '12:00', 'end_time': '13:00', 'duration': 60},
                {'start_time': '13:00', 'end_time': '14:00', 'duration': 60},
                {'start_time': '14:00', 'end_time': '15:00', 'duration': 60},
                {'start_time': '15:00', 'end_time': '16:00', 'duration': 60},
                {'start_time': '16:00', 'end_time': '17:00', 'duration': 60},
                {'start_time': '17:00', 'end_time': '18:00', 'duration': 60},
                {'start_time': '18:00', 'end_time': '19:00', 'duration': 60},
                {'start_time': '19:00', 'end_time': '20:00', 'duration': 60},
                {'start_time': '20:00', 'end_time': '21:00', 'duration': 60},
                {'start_time': '21:00', 'end_time': '22:00', 'duration': 60},
            ]
            for s_data in slots_data:
                slot = TimeSlot(**s_data)
                db.session.add(slot)
            db.session.commit()
            print(f"Initialized {len(slots_data)} time slots")

        print("Database initialization completed!")


if __name__ == '__main__':
    init_db()
