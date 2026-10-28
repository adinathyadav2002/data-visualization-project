from pydantic import BaseModel
from typing import Optional
pydantic_model = BaseModel


class User(BaseModel):
    first_name: Optional[str] = ""
    last_name: Optional[str] = ""
    email: str
    password: str


class UserResponse(BaseModel):
    statusCode: int
    message: str = "Success!"
    user: User
