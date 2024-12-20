import ssl
import os
from paho.mqtt.client import Client as MQTTClient
from .crud import add_measurement
from .dependencies import get_broadcaster
from .core.config import settings
import json
import asyncio
from threading import Thread

def on_connect(client, userdata, flags, rc):
    print("Connected " + str(rc))
    client.subscribe("device/measurements")

def on_message(client, userdata, msg):
    print(f"Received message on {msg.topic}: {str(msg.payload.decode('utf-8'))}")
    asyncio.run_coroutine_threadsafe(handle_message(msg), mqtt_loop)

def publish_message(topic, message):
    client = MQTTClient()
    client.tls_set(
        ca_certs=settings.AWS_CA_CERT,  
        certfile=settings.AWS_CERT, 
        keyfile=settings.AWS_PRIVATE_KEY, 
        cert_reqs=ssl.CERT_REQUIRED,
        tls_version=ssl.PROTOCOL_TLSv1_2
    )
    client.connect(settings.AWS_IOT_ENDPOINT, 8883, 60)

    client.loop_start()
    client.publish(topic, message, qos=1)
    client.loop_stop()
    client.disconnect()


async def handle_message(msg):
    try:
        data = json.loads(msg.payload.decode('utf-8'))
    except json.JSONDecodeError as e:
        print(f"Error: {e}")
        return 

    try:
        percents = data['level']
        print(f"Level: {percents}%")
    except KeyError:
        print("Incorrect data format")
        return  

    add_measurement(percents)

    broadcaster = get_broadcaster()
    await broadcaster.broadcast(f"{percents}")

def start_mqtt_client():
    global mqtt_loop 
    mqtt_loop = asyncio.new_event_loop()
    asyncio.set_event_loop(mqtt_loop)

    mqtt_client = MQTTClient()
    mqtt_client.tls_set(
        ca_certs=settings.AWS_CA_CERT,  
        certfile=settings.AWS_CERT, 
        keyfile=settings.AWS_PRIVATE_KEY, 
        cert_reqs=ssl.CERT_REQUIRED,
        tls_version=ssl.PROTOCOL_TLSv1_2
    )
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message

    mqtt_client.connect(settings.AWS_IOT_ENDPOINT, 8883, 60)
    mqtt_client.loop_start() 

    try:
        mqtt_loop.run_forever()  
    except KeyboardInterrupt:
        print("Off")
    finally:
        mqtt_client.loop_stop()
        mqtt_client.disconnect()
        mqtt_loop.stop()
        mqtt_loop.close()
