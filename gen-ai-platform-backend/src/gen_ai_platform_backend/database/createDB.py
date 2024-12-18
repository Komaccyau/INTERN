import asyncio
import datetime

from database import create_content, create_document
from gen_ai_platform_backend.schema.schema import ChatList, ChatMessage, Message, User


async def main():
    await create_document(document=User)
    await create_content(User(name="例のユーザ名", uid="testes000", icon_path="PATH"))

    await create_document(document=ChatList)
    await create_content(ChatList(user_id="111", room_name="てすと"))

    dt_now = datetime.datetime.now()
    messages = Message(role="test", content="aaaa")
    await create_document(document=ChatMessage)
    await create_content(
        ChatMessage(
            chat_id="111",
            ai_model="gpt-4o-mini-2024-07-24",
            message=messages,
            data_time=str(dt_now),
        ),
    )


if __name__ == "__main__":
    asyncio.run(main())
