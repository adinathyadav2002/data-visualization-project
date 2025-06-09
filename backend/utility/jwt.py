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

    @staticmethod
    def verify_jwt_token(token: str, secret_key: str = "my_secret", algorithm: str = "HS256"):
        """
        Verify a JWT token.
        :param token: The JWT token to verify.
        :param secret_key: The secret key to verify the JWT.
        :param algorithm: The algorithm used to sign the JWT.
        :return: The decoded payload if the token is valid, otherwise raises an exception.
        """
        try:
            payload = jwt.decode(token, secret_key, algorithms=[algorithm])

            user_id = payload.get("user_id")
            if user_id is None:
                raise Exception("Invalid token: user_id not found in payload")
            return payload
        except jwt.ExpiredSignatureError:
            raise Exception("Token has expired")
        except jwt.InvalidTokenError:
            raise Exception("Invalid token")
