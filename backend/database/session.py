from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Replace 'yourpassword' with your actual MySQL password
SQLALCHEMY_DATABASE_URL = "mysql+mysqldb://root:Adinathsy%40123@localhost/data_visualization"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, echo=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
