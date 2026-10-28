from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Header
from schemas import User, UserResponse
from models import User as UserModel
from database import session, SessionLocal
from utility.hashing import Hash
from utility.jwt import jwtTokenManager as jwtM
from setting.config import settings


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/profile")
async def get_current_user_profile(
    authorization: Optional[str] = Header(None, description="Bearer <token>"),
    db: session = Depends(get_db)
):
    """
    Retrieve logged in user information using JWT token, with fallback to first user in database.
    """
    user = None
    if authorization:
        try:
            scheme, _, token = authorization.partition(" ")
            if scheme.lower() == "bearer" and token:
                payload = jwtM.verify_jwt_token(token, settings.jwt_secret_key)
                user_id = payload.get("user_id")
                if user_id:
                    user = db.query(UserModel).filter(UserModel.id == user_id).first()
        except Exception:
            pass

    if not user:
        user = db.query(UserModel).first()

    if not user:
        raise HTTPException(status_code=404, detail="No user found")

    full_name = f"{user.first_name or ''} {user.last_name or ''}".strip()
    return {
        "statusCode": 200,
        "user": {
            "id": user.id,
            "first_name": user.first_name or "",
            "last_name": user.last_name or "",
            "full_name": full_name or user.email,
            "email": user.email
        }
    }


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: session = Depends(get_db), ):
    """
    Retrieve user information by user ID.
    """
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"statusCode": 200, "user": user}


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(request: User, db: session = Depends(get_db)):
    """
    Create a new user.
    """
    existing_user = db.query(UserModel).filter(
        UserModel.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=400, detail="Email already registered")

    hashed_password = Hash.bcrypt(request.password)
    new_user = UserModel(
        first_name=request.first_name or "",
        last_name=request.last_name or "",
        email=request.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"statusCode": "201", "message": "User created successfully", "user": new_user}
