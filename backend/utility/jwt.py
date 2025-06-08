from datetime import datetime, timedelta, timezone
import jwt


class jwtTokenManager:
    """
    A class to manage JWT tokens.
    """
    @staticmethod
    def create_jwt_token(user_id: int, secret_key: str = "my_secret", algorithm: str = "HS256"):
        """
        Create a JWT token for the user.
        :param secret_key: The secret key to sign the JWT.
        :param algorithm: The algorithm to use for signing the JWT.
        :return: A signed JWT token as a string.
        """

        expiration = datetime.now(timezone.utc) + timedelta(days=1)

        payload = {
            "user_id": user_id,
            "exp": expiration
        }
        token = jwt.encode(payload, secret_key, algorithm=algorithm)
        return token
