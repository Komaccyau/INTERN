import datetime
import json
import mimetypes

import requests
from fastapi import HTTPException
from requests.exceptions import Timeout

from ..config import config
from ..utils.base64 import encode_base64
from ..database.database import create_content
from ..schema.schema import ChatMessage, Message

POST_API = config.POST_API
OPENAI_URL = config.OPENAI_URL
OPENAI_KEY = config.OPENAI_KEY


async def post_chat(chat_message):

    # TODO:ここコメントアウト
    system_message = Message(
        role="system",
        content="You will be provided with statements, and your task is to convert them to standard English.",
    )
    dt_now = datetime.datetime.now()
    await create_content(
        ChatMessage(
            chat_id=chat_message.chat_id, ai_model=chat_message.ai_model, message=system_message, data_time=str(dt_now)
        )
    )

    if chat_message.img_path:

        encode_imag = encode_base64(chat_message.img_path)

        mime_type = mimetypes.guess_type(chat_message.img_path)[0]
        if chat_message.message.content:

            content_list = [
                {"type": "text", "text": chat_message.message.content},  # ここでの content も確認
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:{mime_type};base64,{encode_imag}"},
                },  # 画像のパスを渡す
            ]
            image_message = {"role": chat_message.message.role, "content": content_list}
            response = dict(system_message), image_message
        else:

            content_list = [
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:{mime_type};base64,{encode_imag}"},
                },  # 画像のパスを渡す
            ]
            image_message = {"role": chat_message.message.role, "content": content_list}
            response = dict(system_message), image_message

    else:
        response = dict(system_message), dict(chat_message.message)

    payload = json.dumps({"model": chat_message.ai_model, "messages": response})

    headers = {
        "Authorization": f"Bearer {OPENAI_KEY}",
        "Content-Type": "application/json; charset=utf-8",
    }

    try:
        # ダミーAPI
        response = requests.request(
            "POST", POST_API, headers=headers, data=payload, json={"key": "value"}, timeout=5.0
        ).json()

        # openai
        # response = requests.request(
        #     "POST", OPENAI_URL, headers=headers, data=payload, json={"key": "value"}, timeout=5.0
        # ).json()

        json_response = response["choices"][0]["message"]

        response_message = Message(
            role=json_response["role"],
            content=json_response["content"],
        )

        await create_content(
            ChatMessage(
                chat_id=chat_message.chat_id,
                ai_model=chat_message.ai_model,
                message=response_message,
                data_time=str(dt_now),
            )
        )

        return {"result": response_message}

    except Timeout:
        raise HTTPException(status_code=504, detail="タイムアウトが発生しました")

    except KeyError as e:
        raise e
