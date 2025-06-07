from typing import Optional
from pydantic import BaseModel


class UserAuthDetails(BaseModel):
    userName: Optional[str] = None
    email: Optional[str] = None
    password: str
