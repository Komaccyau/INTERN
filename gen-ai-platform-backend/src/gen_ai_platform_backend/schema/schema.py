import datetime
from typing import Optional

from beanie import Document
from pydantic import BaseModel


class User(Document):
    name: str
    uid: str
    icon_path: str


class ChatList(Document):
    user_id: str
    room_name: str


class Message(BaseModel):
    role: str
    content: Optional[str] = None


class ChatMessage(Document):
    chat_id: str
    ai_model: str
    message: Message
    img_path: Optional[str] = None
    data_time: Optional[str] = str(datetime.datetime.now())


class ChatInfo(BaseModel):
    room_id: Optional[str] = None
    uid: Optional[str] = None


class TokenData(BaseModel):
    uid: str


class UpdateRoomNameRequest(BaseModel):
    chat_id: str
    new_chat_name: str
