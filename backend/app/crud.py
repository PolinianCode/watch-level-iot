from .models import SessionLocal, Measurement

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
