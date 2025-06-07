from fastapi import APIRouter, Depends, HTTPException, status
from schemas import User, UserResponse
from models import User as UserModel
from database import session, SessionLocal
from utility.hashing import Hash


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


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
        first_name=request.first_name,
        last_name=request.last_name,
        email=request.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"statusCode": "201", "message": "User created successfully", "user": new_user}
