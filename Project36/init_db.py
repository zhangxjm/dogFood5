from models import db, ParkingSlot, ParkingRecord
from config import Config


def init_slots():
    existing = ParkingSlot.query.first()
    if existing:
        return

    slots = []
    for i in range(1, Config.TOTAL_SLOTS + 1):
        slot = ParkingSlot(
            slot_number=f'A{i:03d}',
            status='available'
        )
        slots.append(slot)

    db.session.add_all(slots)
    db.session.commit()
    print(f'Initialized {Config.TOTAL_SLOTS} parking slots.')
