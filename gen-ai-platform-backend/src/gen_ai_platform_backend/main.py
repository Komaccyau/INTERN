from fastapi import FastAPI, Depends, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import json
import uvicorn

from .config import config
from .database.database import (
    create_content,
    db_init,
    get_messages,
    get_chat_list,
    search_user,
    create_chat,
    update_room_name,
    delete_chat_data,
)
from .services.post_chat import post_chat
from .schema.schema import ChatMessage, TokenData, Message, UpdateRoomNameRequest
from .services.firebase import verify_token, firebase_init
from .utils.save_img import save_img

REACT_URL = config.REACT_URL
LOCAL_HOST_URL = config.LOCAL_HOST_URL


app = FastAPI()


async def startup_event():
    await db_init()
    firebase_init()


app.add_event_handler("startup", startup_event)

# CORSの設定
origins = [REACT_URL, LOCAL_HOST_URL]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/chat")
async def chat(data: str = Form(...), file: UploadFile = File(None), token_data: TokenData = Depends(verify_token)):
    chat_message_data = json.loads(data)
    chat_message = ChatMessage(
        chat_id=chat_message_data["chat_id"],
        ai_model=chat_message_data["ai_model"],
        message=Message(role=chat_message_data["message"]["role"], content=chat_message_data["message"]["content"]),
    )

    if file:
        chat_message.img_path = await save_img(file)

    await create_content(chat_message)
    response_message = await post_chat(chat_message)

    return {"response": response_message}


@app.get("/chat-history/{room_id}")
async def get_chat_messages(room_id: str, token_data: TokenData = Depends(verify_token)):
    chat_id = room_id
    messages = await get_messages(chat_id)
    return {"messages": messages}


@app.get("/images/{filename}")
async def get_image(filename: str):
    file_location = f"./images/{filename}"
    return FileResponse(file_location)


@app.get("/chat-rooms/{uid}")
async def get_rooms(uid: str, token_data: TokenData = Depends(verify_token)):
    rooms = await get_chat_list(uid)
    return {"rooms": rooms}


@app.get("/login")
async def login(token_data: TokenData = Depends(verify_token)):
    uid = token_data.uid
    await search_user(uid)
    return {"uid": uid}


@app.post("/new-chat")
async def new_chat(
    data: str = Form(...), file: UploadFile = File(None), token_data: TokenData = Depends(verify_token)
):
    data = json.loads(data)

    uid = data["uid"]
    content = data["message"]["content"]
    if not content and file:
        chat_name = "画像データ"
    else:
        chat_name = content

    chat_document = await create_chat(uid, chat_name)

    chat_id = str(chat_document["id"])
    chat_name = str(chat_document["room_name"])

    chat_message = ChatMessage(
        chat_id=chat_id,
        ai_model=data["ai_model"],
        message=Message(role=data["message"]["role"], content=content),
    )

    if file:
        chat_message.img_path = await save_img(file)

    await create_content(chat_message)
    message = await post_chat(chat_message)
    response = {"chat_data": ({"id": chat_id, "name": chat_name}), "message": message}
    return {"response": response}


@app.post("/update-room-name")
async def update_room(request: UpdateRoomNameRequest, token_data: TokenData = Depends(verify_token)):
    chat_id = request.chat_id
    new_chat_name = request.new_chat_name
    await update_room_name(chat_id, new_chat_name)
    response = {"chat_data": ({"id": chat_id, "name": new_chat_name})}
    return {"response": response}


@app.delete("/delete-chat/{chat_id}")
async def delete_chat(chat_id: str, token_data: TokenData = Depends(verify_token)):
    await delete_chat_data(chat_id)
    return 0


if __name__ == "__main__":
    uvicorn.run("src.gen_ai_platform_backend.main:app", port=8000, reload=True)
