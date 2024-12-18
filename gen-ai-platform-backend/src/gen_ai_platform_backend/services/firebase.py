import firebase_admin
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth, credentials

from ..config import config
from ..schema.schema import TokenData

FIREBASE_KEY = config.FIREBASE_KEY


def firebase_init():
    # Firebase Admin SDKの初期化
    cred = credentials.Certificate(FIREBASE_KEY)
    firebase_admin.initialize_app(cred)


async def verify_token(token: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
    try:

        # ユーザー情報を取得
        decoded_token = auth.verify_id_token(token.credentials)
        return TokenData(uid=decoded_token["uid"])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
