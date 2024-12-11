# main.py

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from threading import Thread
from .mqtt_client import start_mqtt_client, publish_message
from .dependencies import get_broadcaster
from pydantic import BaseModel
from .models import Limits, SessionLocal, Measurement
from .crud import get_last_slider_limits
from datetime import datetime
from .core.config import settings
import json

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    thread = Thread(target=start_mqtt_client)
    thread.start()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    broadcaster = get_broadcaster()
    await broadcaster.connect(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received: {data}")
            await websocket.send_text(f"Echo: {data}")
    except WebSocketDisconnect:
        print("Client disconnected")
        await broadcaster.disconnect(websocket)
    except Exception as e:
        print(f"Error: {e}")
    finally:
        print("Connection closed")

class LevelLimits(BaseModel):
    lowerLimit: int
    upperLimit: int

class DateRangeRequest(BaseModel):
    start_date: str
    end_date: str

@app.post("/level_limits")
async def set_level_limits(level_limits: LevelLimits):
    lower_limit = level_limits.lowerLimit
    upper_limit = level_limits.upperLimit

    db = SessionLocal()

    new_limit = Limits(low = lower_limit, high = upper_limit)

    db.add(new_limit)
    db.commit()
    db.refresh(new_limit)
    
    message = json.dumps({"firstTH": lower_limit, "secondTH": upper_limit})
    topic = settings.MQTT_TOPIC_LED


    publish_message(topic, message)

    print(f"Received level limits: Lower: {lower_limit}, Upper: {upper_limit}")

    return {"status": "success", "message": "Level limits updated"}


@app.get("/level_limits")
async def get_level_limits():
    db = SessionLocal()

    last_limits = get_last_slider_limits()
    if last_limits:
        return {"lowerLimit": last_limits.low, "upperLimit": last_limits.high}
    else:
        return {"lowerLimit": 20, "upperLimit": 80}
    

@app.post('/history')
async def get_history_data(request: DateRangeRequest):
    db = SessionLocal()

    start_date = datetime.strptime(request.start_date, "%Y-%m-%d")
    end_date = datetime.strptime(request.end_date, "%Y-%m-%d")


    end_date = end_date.replace(hour=23, minute=59, second=59, microsecond=999999)

    query = db.query(Measurement).filter(Measurement.timestamp >= start_date, Measurement.timestamp <= end_date).all()

    return {"data": query}