from .models import SessionLocal, Measurement, Limits


def add_measurement(value):
    db = SessionLocal()
    try:
        new_measurement = Measurement(value=value)
        db.add(new_measurement)
        db.commit()
        db.refresh(new_measurement)
        return new_measurement
    finally:
        db.close()

def get_last_slider_limits():
    db = SessionLocal()
    return db.query(Limits).order_by(Limits.id.desc()).first()
