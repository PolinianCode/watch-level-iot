# main.py

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from threading import Thread
from .mqtt_client import start_mqtt_client
from .dependencies import get_broadcaster

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

    # Register the WebSocket connection with the broadcaster
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
