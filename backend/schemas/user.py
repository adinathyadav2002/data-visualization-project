from pydantic import BaseModel
pydantic_model = BaseModel


class User(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str


class UserResponse(BaseModel):
    statusCode: int
    message: str = "Success!"
    user: User
