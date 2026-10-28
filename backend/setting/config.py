from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "sqlite:///./data_visualization.db"
    origins: str = "*"  # Default to allow all origins, can be overridden in .env
    jwt_secret_key: str = "secret-key-change-in-production"
    jwt_algorithm: str = "HS256"  # Default algorithm for JWT

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


# Create an instance to use throughout your app
settings = Settings()
