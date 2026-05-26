import os
import sys
import base64
import struct
import zlib

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.models import db, User, Category, Score, Favorite

app = create_app()


def create_sample_png(width=400, height=300):
    def create_png_chunk(chunk_type, data):
        chunk = chunk_type + data
        crc = struct.pack('>I', zlib.crc32(chunk) & 0xffffffff)
        return struct.pack('>I', len(data)) + chunk + crc

    header = b'\x89PNG\r\n\x1a\n'
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr = create_png_chunk(b'IHDR', ihdr_data)

    raw_data = b''
    for y in range(height):
        raw_data += b'\x00'
        for x in range(width):
            if y < 50 and 100 < x < 300:
                raw_data += bytes([60, 60, 80])
            elif y % 60 == 0 and y > 30:
                raw_data += bytes([180, 180, 200])
            elif 60 < x % 80 < 75 and y > 40:
                raw_data += bytes([100, 100, 140])
            else:
                raw_data += bytes([240, 240, 245])

    idat_data = zlib.compress(raw_data)
    idat = create_png_chunk(b'IDAT', idat_data)

    iend = create_png_chunk(b'IEND', b'')

    return header + ihdr + idat + iend


def init_data():
    with app.app_context():
        print("Initializing database...")
        db.create_all()

        if User.query.count() > 0:
            print("Database already initialized. Skipping.")
            return

        print("Creating default user...")
        user = User(username='demo_user')
        db.session.add(user)
        db.session.flush()

        print("Creating categories...")
        categories_data = [
            {'name': 'Classical', 'icon': 'music'},
            {'name': 'Jazz', 'icon': 'star'},
            {'name': 'Pop', 'icon': 'heart'},
            {'name': 'Rock', 'icon': 'zap'},
            {'name': 'Folk', 'icon': 'leaf'},
            {'name': 'Piano Solo', 'icon': 'book'},
            {'name': 'Guitar', 'icon': 'music'},
            {'name': 'Vocal', 'icon': 'mic'},
        ]

        categories = {}
        for cat_data in categories_data:
            cat = Category(name=cat_data['name'], icon=cat_data['icon'])
            db.session.add(cat)
            categories[cat_data['name']] = cat

        db.session.flush()

        print("Creating sample scores...")
        upload_folder = app.config['UPLOAD_FOLDER']
        os.makedirs(upload_folder, exist_ok=True)

        png_data = create_sample_png()

        sample_scores = [
            {'title': 'Moonlight Sonata', 'composer': 'Beethoven', 'category': 'Classical',
             'desc': 'Piano Sonata No.14 in C-sharp minor'},
            {'title': 'Canon in D', 'composer': 'Pachelbel', 'category': 'Classical',
             'desc': 'Famous Baroque canon'},
            {'title': 'Take Five', 'composer': 'Dave Brubeck', 'category': 'Jazz',
             'desc': 'Jazz standard in 5/4 time'},
            {'title': 'Somewhere Over', 'composer': 'Harold Arlen', 'category': 'Pop',
             'desc': 'Classic from The Wizard of Oz'},
            {'title': 'Bohemian Rhapsody', 'composer': 'Queen', 'category': 'Rock',
             'desc': 'Epic rock ballad'},
            {'title': 'Hallelujah', 'composer': 'Leonard Cohen', 'category': 'Pop',
             'desc': 'Contemporary classic'},
            {'title': 'Clair de Lune', 'composer': 'Debussy', 'category': 'Piano Solo',
             'desc': 'Impressionist piano piece'},
            {'title': 'Wonderful Tonight', 'composer': 'Eric Clapton', 'category': 'Guitar',
             'desc': 'Guitar ballad'},
            {'title': 'Amazing Grace', 'composer': 'Traditional', 'category': 'Folk',
             'desc': 'Traditional hymn'},
            {'title': 'Memory', 'composer': 'Andrew Lloyd Webber', 'category': 'Vocal',
             'desc': 'From Cats the musical'},
            {'title': 'Autumn Leaves', 'composer': 'Joseph Kosma', 'category': 'Jazz',
             'desc': 'Jazz standard'},
            {'title': 'Let It Be', 'composer': 'The Beatles', 'category': 'Pop',
             'desc': 'Beatles classic'},
        ]

        for idx, score_data in enumerate(sample_scores):
            cat = categories.get(score_data['category'])

            filename = f"sample_{score_data['title'].replace(' ', '_').lower()}.png"
            filepath = os.path.join(upload_folder, filename)

            with open(filepath, 'wb') as f:
                f.write(png_data)

            file_size = os.path.getsize(filepath)

            score = Score(
                title=score_data['title'],
                composer=score_data['composer'],
                description=score_data['desc'],
                filename=filename,
                file_type='png',
                file_size=file_size,
                category_id=cat.id if cat else None,
                uploaded_by=user.id
            )
            db.session.add(score)
            db.session.flush()

            if score_data['title'] in ['Moonlight Sonata', 'Hallelujah', 'Canon in D']:
                fav = Favorite(user_id=user.id, score_id=score.id)
                db.session.add(fav)

        db.session.commit()

        print(f"Created {User.query.count()} users")
        print(f"Created {Category.query.count()} categories")
        print(f"Created {Score.query.count()} scores")
        print(f"Created {Favorite.query.count()} favorites")
        print("Initialization complete!")


if __name__ == '__main__':
    init_data()
