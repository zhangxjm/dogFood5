from app.database import SessionLocal
from app import models
from app.auth import hash_password


def seed_data():
    db = SessionLocal()
    try:
        _seed_categories(db)
        _seed_users(db)
        _seed_books(db)
        _seed_messages(db)
    finally:
        db.close()


def _seed_categories(db):
    categories = [
        {"name": "Computer Science", "description": "Programming, algorithms, AI, and more"},
        {"name": "Literature", "description": "Novels, poetry, and literary works"},
        {"name": "Mathematics", "description": "Algebra, calculus, statistics"},
        {"name": "Physics", "description": "Classical and modern physics"},
        {"name": "Economics", "description": "Micro and macro economics"},
        {"name": "History", "description": "World history and civilizations"},
        {"name": "Philosophy", "description": "Ethics, metaphysics, logic"},
        {"name": "Language", "description": "Foreign language study materials"},
    ]
    for c in categories:
        exists = db.query(models.Category).filter(models.Category.name == c["name"]).first()
        if not exists:
            db.add(models.Category(**c))
    db.commit()


def _seed_users(db):
    users = [
        {
            "username": "alice",
            "email": "alice@campus.edu",
            "password": "alice123",
            "full_name": "Alice Wang",
            "campus": "Main Campus",
            "contact": "WeChat: alice_wx",
        },
        {
            "username": "bob",
            "email": "bob@campus.edu",
            "password": "bob12345",
            "full_name": "Bob Li",
            "campus": "East Campus",
            "contact": "QQ: 123456789",
        },
        {
            "username": "carol",
            "email": "carol@campus.edu",
            "password": "carol123",
            "full_name": "Carol Zhang",
            "campus": "South Campus",
            "contact": "Email: carol@campus.edu",
        },
    ]
    for u in users:
        exists = db.query(models.User).filter(models.User.username == u["username"]).first()
        if not exists:
            db.add(
                models.User(
                    username=u["username"],
                    email=u["email"],
                    hashed_password=hash_password(u["password"]),
                    full_name=u["full_name"],
                    campus=u["campus"],
                    contact=u["contact"],
                )
            )
    db.commit()


def _seed_books(db):
    alice = db.query(models.User).filter(models.User.username == "alice").first()
    bob = db.query(models.User).filter(models.User.username == "bob").first()
    carol = db.query(models.User).filter(models.User.username == "carol").first()
    cs_id = db.query(models.Category).filter(models.Category.name == "Computer Science").first().id
    lit_id = db.query(models.Category).filter(models.Category.name == "Literature").first().id
    math_id = db.query(models.Category).filter(models.Category.name == "Mathematics").first().id
    phys_id = db.query(models.Category).filter(models.Category.name == "Physics").first().id
    econ_id = db.query(models.Category).filter(models.Category.name == "Economics").first().id

    books = [
        {
            "title": "Introduction to Algorithms",
            "author": "Thomas H. Cormen",
            "isbn": "9780262033848",
            "publisher": "MIT Press",
            "publish_year": 2009,
            "condition": "Good",
            "description": "Classic algorithms textbook, slightly used with some highlights.",
            "status": "available",
            "owner_id": alice.id,
            "category_id": cs_id,
        },
        {
            "title": "Clean Code",
            "author": "Robert C. Martin",
            "isbn": "9780132350884",
            "publisher": "Prentice Hall",
            "publish_year": 2008,
            "condition": "Excellent",
            "description": "A handbook of agile software craftsmanship.",
            "status": "available",
            "owner_id": alice.id,
            "category_id": cs_id,
        },
        {
            "title": "One Hundred Years of Solitude",
            "author": "Gabriel Garcia Marquez",
            "isbn": "9780060883287",
            "publisher": "Harper Perennial",
            "publish_year": 2006,
            "condition": "Good",
            "description": "Magical realism masterpiece.",
            "status": "available",
            "owner_id": bob.id,
            "category_id": lit_id,
        },
        {
            "title": "Calculus",
            "author": "James Stewart",
            "isbn": "9781285740621",
            "publisher": "Cengage",
            "publish_year": 2015,
            "condition": "Fair",
            "description": "Standard calculus textbook, lots of notes inside.",
            "status": "available",
            "owner_id": bob.id,
            "category_id": math_id,
        },
        {
            "title": "University Physics",
            "author": "Hugh D. Young",
            "isbn": "9780135216118",
            "publisher": "Pearson",
            "publish_year": 2019,
            "condition": "Good",
            "description": "Freshman physics textbook, with Modern Physics.",
            "status": "available",
            "owner_id": carol.id,
            "category_id": phys_id,
        },
        {
            "title": "Principles of Economics",
            "author": "N. Gregory Mankiw",
            "isbn": "9781305585126",
            "publisher": "Cengage",
            "publish_year": 2016,
            "condition": "Excellent",
            "description": "Introductory economics, almost like new.",
            "status": "available",
            "owner_id": carol.id,
            "category_id": econ_id,
        },
    ]
    for b in books:
        exists = db.query(models.Book).filter(models.Book.title == b["title"], models.Book.author == b["author"]).first()
        if not exists:
            db.add(models.Book(**b))
    db.commit()


def _seed_messages(db):
    alice = db.query(models.User).filter(models.User.username == "alice").first()
    bob = db.query(models.User).filter(models.User.username == "bob").first()
    book = db.query(models.Book).filter(models.Book.title == "One Hundred Years of Solitude").first()
    if book and alice and bob:
        exists = db.query(models.Message).filter(models.Message.book_id == book.id, models.Message.sender_id == alice.id).first()
        if not exists:
            db.add(
                models.Message(
                    content="Hi, I would love to exchange my 'Introduction to Algorithms' for this book. Let me know!",
                    intent="exchange",
                    sender_id=alice.id,
                    receiver_id=bob.id,
                    book_id=book.id,
                )
            )
    db.commit()
