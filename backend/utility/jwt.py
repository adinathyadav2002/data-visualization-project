class jwt:
    def create_jwt_token(self, user_id: int, secret_key: str, algorithm: str = "HS256"):
        """
        Create a JWT token for the user.
        :param user_id: The ID of the user.
        :param secret_key: The secret key to sign the JWT.
        :param algorithm: The algorithm to use for signing the JWT.
        :return: A signed JWT token as a string.
        """
        from datetime import datetime, timedelta
        import jwt

        expiration = datetime.utcnow() + timedelta(days=1)
        payload = {
            "user_id": user_id,
            "exp": expiration
        }
        token = jwt.encode(payload, secret_key, algorithm=algorithm)
        return token
