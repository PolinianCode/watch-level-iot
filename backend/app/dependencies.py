from .models import SessionLocal
import asyncio
from fastapi import WebSocket


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Broadcaster:
    def __init__(self):
        self.connections = set()  # Use a set for unique connections

    async def connect(self, websocket: WebSocket):
        """Register a new WebSocket connection"""
        self.connections.add(websocket)

    async def disconnect(self, websocket: WebSocket):
        """Unregister a WebSocket connection"""
        self.connections.remove(websocket)

    async def broadcast(self, message: str):
        """Send a message to all connected WebSocket clients"""
        # Using a set to avoid duplicates
        for connection in self.connections:
            try:
                await connection.send_text(message)
            except:
                # If connection fails, remove it from the set
                self.connections.remove(connection)

# Global broadcaster instance
broadcaster_instance = Broadcaster()

def get_broadcaster():
    """Retrieve the singleton broadcaster instance"""
    return broadcaster_instance