from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
import jwt
from passlib.context import CryptContext

SECRET_KEY = 'b1e92f25a496ddc6b80cc48d3b300d51df89cd8266f3ceba483f70d8bf7e970c'
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def encode_token(user_id: int):
    token_params = {
        'exp': datetime.utcnow() + timedelta(days=0, minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        'iat': datetime.utcnow(),
        'sub': user_id
    }

    return jwt.encode(token_params, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token):
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"id": decoded_token['sub']}
    except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail='Token už expiroval. Prihláste sa znovu prosím.')
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail='Nesprávny token ')

def auth_request(request: Request):
    access_token = request.cookies.get("access_token")
    return access_token