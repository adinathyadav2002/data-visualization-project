from sqlalchemy import Column, Integer, String, Text
from database import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(100), nullable=False)  # Store hashed passwords

    def __repr__(self):
        return f"<User(first_name={self.first_name}, last_name={self.last_name}, email={self.email})>"
