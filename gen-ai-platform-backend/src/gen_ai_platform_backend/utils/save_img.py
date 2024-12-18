import os
import uuid


async def save_img(file):
    # 保存先ディレクトリの作成
    directory = "images"
    if not os.path.exists(directory):
        os.makedirs(directory)

    # UUIDを使って一意なファイル名を生成
    unique_filename = f"{uuid.uuid4()}.{file.filename.split('.')[-1]}"
    file_location = os.path.join(directory, unique_filename)

    # 画像ファイルを保存
    with open(file_location, "wb") as f:
        f.write(await file.read())
    return file_location
