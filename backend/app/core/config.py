from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    AWS_IOT_ENDPOINT: str
    AWS_CA_CERT: str
    AWS_CERT: str
    AWS_PRIVATE_KEY: str
    MQTT_TOPIC: str
    MQTT_TOPIC_LED: str
    DATABASE_URL: str

    class Config:
        env_file = ".env"

settings = Settings()
print(settings.dict()) 