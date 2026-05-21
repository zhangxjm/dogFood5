from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from .database import SessionLocal
from . import crud
import logging

logging.basicConfig()
logging.getLogger('apscheduler').setLevel(logging.WARNING)

scheduler = BackgroundScheduler()


def release_expired_reservations():
    db = SessionLocal()
    try:
        expired_reservations = crud.get_expired_reservations(db, timeout_minutes=15)
        for reservation in expired_reservations:
            crud.release_expired_reservation(db, reservation.id)
            print(f"Released expired reservation: {reservation.id}")
    finally:
        db.close()


def start_scheduler():
    scheduler.add_job(
        release_expired_reservations,
        trigger=IntervalTrigger(minutes=1),
        id="release_expired_reservations",
        name="Release expired reservations every minute",
        replace_existing=True
    )
    scheduler.start()
    print("Scheduler started - checking for expired reservations every minute")


def stop_scheduler():
    scheduler.shutdown()
    print("Scheduler stopped")
