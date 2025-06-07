from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from setting.config import settings

# Replace 'yourpassword' with your actual MySQL password
SQLALCHEMY_DATABASE_URL = settings.database_url

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, echo=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
