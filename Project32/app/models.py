from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    favorites = db.relationship('Favorite', backref='user', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'created_at': self.created_at.isoformat()
        }


class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    icon = db.Column(db.String(50), default='folder')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    scores = db.relationship('Score', backref='category', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'icon': self.icon,
            'score_count': len(self.scores)
        }


class Score(db.Model):
    __tablename__ = 'scores'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    composer = db.Column(db.String(100), default='Unknown')
    description = db.Column(db.Text, default='')
    filename = db.Column(db.String(500), nullable=False)
    file_type = db.Column(db.String(20), nullable=False)
    file_size = db.Column(db.Integer, default=0)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)
    uploaded_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    views = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    favorites = db.relationship('Favorite', backref='score', lazy=True, cascade='all, delete-orphan')
    uploader = db.relationship('User', foreign_keys=[uploaded_by], backref='uploaded_scores')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'composer': self.composer,
            'description': self.description,
            'filename': self.filename,
            'file_type': self.file_type,
            'file_size': self.file_size,
            'category_id': self.category_id,
            'category_name': self.category.name if self.category else 'Uncategorized',
            'uploaded_by': self.uploaded_by,
            'uploader_name': self.uploader.username if self.uploader else 'Anonymous',
            'views': self.views,
            'favorite_count': len(self.favorites),
            'created_at': self.created_at.isoformat()
        }


class Favorite(db.Model):
    __tablename__ = 'favorites'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    score_id = db.Column(db.Integer, db.ForeignKey('scores.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('user_id', 'score_id', name='unique_user_score_favorite'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'score_id': self.score_id,
            'score': self.score.to_dict() if self.score else None,
            'created_at': self.created_at.isoformat()
        }
