import os

from Controllers import DataController, NotasController
from dotenv import load_dotenv
from fastapi import APIRouter

load_dotenv()

TOKEN = os.getenv("MOODLE_TOKEN")
BASE_URL = os.getenv("MOODLE_BASE_URL")  # http://localhost
COURSE_ID = os.getenv("MOODLE_COURSE_ID")

router = APIRouter(prefix="/notas", tags=["notas"])
