from os import environ

from dotenv import load_dotenv

load_dotenv()


DB_URL = environ.get("DB_URL")
DB_NAME = environ.get("DB_NAME")
POST_API = environ.get("POST_API")
REACT_URL = environ.get("REACT_URL")
OPENAI_URL = environ.get("OPENAI_URL")
OPENAI_KEY = environ.get("OPENAI_KEY")
FIREBASE_KEY = environ.get("FIREBASE_KEY")
LOCAL_HOST_URL = environ.get("LOCAL_HOST_URL")
