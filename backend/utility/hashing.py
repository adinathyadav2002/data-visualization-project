import bcrypt


class Hash:
    @staticmethod
    def bcrypt(password: str) -> str:
        pwd_bytes = password.encode("utf-8")[:72]
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")

    @staticmethod
    def verify(plain_password: str, hashed_password: str) -> bool:
        try:
            pwd_bytes = plain_password.encode("utf-8")[:72]
            hashed_bytes = hashed_password.encode("utf-8")
            return bcrypt.checkpw(pwd_bytes, hashed_bytes)
        except Exception:
            return False
