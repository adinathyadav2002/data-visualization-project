from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    origins: str = "*"  # Default to allow all origins, can be overridden in .env
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"  # Default algorithm for JWT

    class Config:
        env_file = ".env"  # Tells Pydantic to read from .env


# Create an instance to use throughout your app
settings = Settings()
