from utility.hashing import Hash
from database import SessionLocal, session
from fastapi import Depends, UploadFile, status, HTTPException, Header, APIRouter
from models import User as UserModel
from schemas import UserAuthDetails
from sqlalchemy import or_
from utility.jwt import jwtTokenManager as jwtM
from setting.config import settings
from sqlalchemy.orm import Session


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
    user = db.query(UserModel).filter(UserModel.email == request.email).first()

    # Check if user exists and password matches
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not Hash.verify(request.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # If user exists and password matches, return success message with jwt token
    token = jwtM.create_jwt_token(
        user.id, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)

    return {"message": "Login successful", "token": token}


@router.post("/verify", status_code=status.HTTP_200_OK)
def verify_token(
    authorization: str = Header(..., description="Bearer <token>"),
    db: Session = Depends(get_db)
):
    """
    Verify JWT token from Authorization header.
    """
    try:
        # Expecting header: Authorization: Bearer <token>
        scheme, _, token = authorization.partition(" ")
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid auth scheme")

        payload = jwtM.verify_jwt_token(token, settings.jwt_secret_key)
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(
                status_code=401, detail="Invalid token: user_id not found")

        user = db.query(UserModel).filter(UserModel.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return {"message": "Token is valid", "payload": payload}

    except Exception as e:
        raise HTTPException(
            status_code=401, detail=f"Token verification failed: {str(e)}")
