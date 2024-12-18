from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
import os
from bson import ObjectId

try:
    from ..config import config
    from ..schema.schema import ChatList, ChatMessage, User
except ImportError:
    from gen_ai_platform_backend.config import config
    from gen_ai_platform_backend.schema.schema import ChatList, ChatMessage, User


DB_URL = config.DB_URL
DB_NAME = config.DB_NAME
# MongoDBに接続
client = AsyncIOMotorClient(DB_URL)[DB_NAME]


async def db_init():
    # Create Motor client
    # client = AsyncIOMotorClient(DB_URL)[DB_NAME]

    # Initialize beanie with multiple document classes and a database
    await init_beanie(database=client, document_models=[User, ChatMessage, ChatList])


async def create_document(document):
    await init_beanie(database=client, document_models=[document])


async def create_content(content):
    result = await content.insert()
    return result  # ここで _id を取得


async def get_messages(chat_id):

    query = {"chat_id": chat_id, "message.role": {"$ne": "system"}}  # 'system'ではない

    messages_document = await ChatMessage.find(query).to_list()

    message_data_list = []
    for message in messages_document:
        message_data = []
        message_data.append(message.message)

        if message.img_path and os.path.exists(message.img_path):
            path = os.path.basename(message.img_path)
            message_data.append(path)
        else:
            message_data.append(None)

        message_data_list.append(message_data)

    return message_data_list


async def get_chat_list(uid):
    query = {"user_id": uid}
    chat_document = await ChatList.find(query).to_list()
    chat_list = []

    if chat_document:
        for chat in chat_document:
            chat_list.append({"id": str(chat.id), "name": chat.room_name})

    return chat_list


async def search_user(uid):
    # 確認したい条件
    query = {"uid": uid}  # ここに確認したい条件を指定

    # ドキュメントの存在確認
    existing_document = await client.User.find_one(query)

    if not existing_document:
        # 新規ドキュメントを作成
        await create_content(User(name="ユーザ", uid=uid, icon_path="PATH"))


async def create_chat(uid, message):
    room_name = ""
    if len(message) <= 5:
        room_name = message
    else:
        for i in range(len(message)):
            if i < 5:
                room_name += message[i]
                if i == 4:
                    room_name += "..."
            else:
                break

    result = await create_content(ChatList(user_id=uid, room_name=room_name))
    document = list(await ChatList.find_one({"_id": result.id}))

    return dict(document)


async def update_room_name(chat_id, new_room_name):

    result = await client.ChatList.update_one(
        {"_id": ObjectId(chat_id)},
        {"$set": {"room_name": new_room_name}},
    )
    return result


async def delete_chat_data(chat_id):
    await client.ChatList.delete_one({"_id": ObjectId(chat_id)})
    query = {"chat_id": chat_id, "message.role": "user"}

    messages_document = await ChatMessage.find(query).to_list()
    for message in messages_document:
        if message.img_path and os.path.exists(message.img_path):
            os.remove(message.img_path)

    await client.ChatMessage.delete_many({"chat_id": chat_id})
