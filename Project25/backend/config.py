import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

DB_TYPE = os.getenv('DB_TYPE', 'sqlite')

if DB_TYPE == 'postgresql':
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = os.getenv('DB_PORT', '5432')
    DB_USER = os.getenv('DB_USER', 'art_user')
    DB_PASSWORD = os.getenv('DB_PASSWORD', 'art_pass_2024')
    DB_NAME = os.getenv('DB_NAME', 'art_lesson')
    SQLALCHEMY_DATABASE_URI = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
else:
    DB_PATH = os.path.join(BASE_DIR, 'art_lesson.db')
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{DB_PATH}'

class Config:
    SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': 5,
        'pool_recycle': 3600,
        'pool_pre_ping': True
    } if DB_TYPE == 'postgresql' else {}
