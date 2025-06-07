from utility.hashing import Hash
from database import SessionLocal, session
from fastapi import Depends, UploadFile, File, HTTPException, Query, APIRouter
from models import User as UserModel
from schemas import UserAuthDetails
from sqlalchemy import or_
from utility.jwt import jwt
from setting.config import settings


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


router = APIRouter(tags=["authentication"])


@router.post("/login")
def login(request: UserAuthDetails, db: session = Depends(get_db)):
    """
    Login endpoint.
    This is a placeholder for the actual login logic.
    """

    # Find user from database
    user = db.query(UserModel).filter(or_(UserModel.email ==
                                          request.email, UserModel.userName == request.userName)).first()

    # Check if user exists and password matches
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not Hash.verify(request.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # If user exists and password matches, return success message with jwt token
    token = jwt.create_jwt_token(
        user.id, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    return {"message": "Login successful", "token": token}
