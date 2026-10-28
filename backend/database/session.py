from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from setting.config import settings

# Replace 'yourpassword' with your actual MySQL password
SQLALCHEMY_DATABASE_URL = settings.database_url

connect_args = {"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args, echo=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
