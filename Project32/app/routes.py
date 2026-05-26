import os
import uuid
from datetime import datetime
from flask import Blueprint, request, jsonify, render_template, current_app
from werkzeug.utils import secure_filename
from app.models import db, User, Category, Score, Favorite

main_bp = Blueprint('main', __name__)
api_bp = Blueprint('api', __name__)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']


def get_or_create_default_user():
    user = User.query.filter_by(username='demo_user').first()
    if not user:
        user = User(username='demo_user')
        db.session.add(user)
        db.session.commit()
    return user


@main_bp.route('/')
def index():
    return render_template('index.html')


@api_bp.route('/scores', methods=['GET'])
def get_scores():
    category_id = request.args.get('category_id', type=int)
    search = request.args.get('search', '').strip()
    sort_by = request.args.get('sort_by', 'created_at')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)

    query = Score.query

    if category_id:
        query = query.filter_by(category_id=category_id)

    if search:
        query = query.filter(
            db.or_(
                Score.title.ilike(f'%{search}%'),
                Score.composer.ilike(f'%{search}%'),
                Score.description.ilike(f'%{search}%')
            )
        )

    if sort_by == 'views':
        query = query.order_by(Score.views.desc())
    elif sort_by == 'title':
        query = query.order_by(Score.title.asc())
    else:
        query = query.order_by(Score.created_at.desc())

    scores = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'scores': [s.to_dict() for s in scores.items],
        'total': scores.total,
        'pages': scores.pages,
        'current_page': page
    })


@api_bp.route('/scores/<int:score_id>', methods=['GET'])
def get_score(score_id):
    score = Score.query.get_or_404(score_id)
    score.views += 1
    db.session.commit()
    return jsonify(score.to_dict())


@api_bp.route('/scores', methods=['POST'])
def upload_score():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400

    title = request.form.get('title', '').strip()
    composer = request.form.get('composer', 'Unknown').strip()
    description = request.form.get('description', '').strip()
    category_id = request.form.get('category_id', type=int)

    if not title:
        title = file.filename.rsplit('.', 1)[0]

    ext = file.filename.rsplit('.', 1)[1].lower()
    unique_filename = f"{uuid.uuid4().hex}_{int(datetime.utcnow().timestamp())}.{ext}"

    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(filepath)
    file_size = os.path.getsize(filepath)

    user = get_or_create_default_user()

    score = Score(
        title=title,
        composer=composer or 'Unknown',
        description=description,
        filename=unique_filename,
        file_type=ext,
        file_size=file_size,
        category_id=category_id,
        uploaded_by=user.id
    )

    db.session.add(score)
    db.session.commit()

    return jsonify(score.to_dict()), 201


@api_bp.route('/scores/<int:score_id>', methods=['DELETE'])
def delete_score(score_id):
    score = Score.query.get_or_404(score_id)

    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], score.filename)
    if os.path.exists(filepath):
        os.remove(filepath)

    db.session.delete(score)
    db.session.commit()

    return jsonify({'message': 'Score deleted successfully'})


@api_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.order_by(Category.name).all()
    return jsonify([c.to_dict() for c in categories])


@api_bp.route('/categories', methods=['POST'])
def create_category():
    data = request.get_json()
    name = data.get('name', '').strip()
    icon = data.get('icon', 'folder')

    if not name:
        return jsonify({'error': 'Category name is required'}), 400

    if Category.query.filter_by(name=name).first():
        return jsonify({'error': 'Category already exists'}), 400

    category = Category(name=name, icon=icon)
    db.session.add(category)
    db.session.commit()

    return jsonify(category.to_dict()), 201


@api_bp.route('/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    category = Category.query.get_or_404(category_id)
    db.session.delete(category)
    db.session.commit()
    return jsonify({'message': 'Category deleted successfully'})


@api_bp.route('/favorites', methods=['GET'])
def get_favorites():
    user = get_or_create_default_user()
    favorites = Favorite.query.filter_by(user_id=user.id).order_by(Favorite.created_at.desc()).all()
    return jsonify([f.to_dict() for f in favorites])


@api_bp.route('/favorites/<int:score_id>', methods=['POST'])
def add_favorite(score_id):
    user = get_or_create_default_user()
    score = Score.query.get_or_404(score_id)

    existing = Favorite.query.filter_by(user_id=user.id, score_id=score_id).first()
    if existing:
        return jsonify({'error': 'Already in favorites'}), 400

    favorite = Favorite(user_id=user.id, score_id=score_id)
    db.session.add(favorite)
    db.session.commit()

    return jsonify(favorite.to_dict()), 201


@api_bp.route('/favorites/<int:score_id>', methods=['DELETE'])
def remove_favorite(score_id):
    user = get_or_create_default_user()
    favorite = Favorite.query.filter_by(user_id=user.id, score_id=score_id).first_or_404()

    db.session.delete(favorite)
    db.session.commit()

    return jsonify({'message': 'Removed from favorites'})


@api_bp.route('/favorites/check/<int:score_id>', methods=['GET'])
def check_favorite(score_id):
    user = get_or_create_default_user()
    favorite = Favorite.query.filter_by(user_id=user.id, score_id=score_id).first()
    return jsonify({'is_favorite': favorite is not None})


@api_bp.route('/stats', methods=['GET'])
def get_stats():
    return jsonify({
        'total_scores': Score.query.count(),
        'total_categories': Category.query.count(),
        'total_favorites': Favorite.query.count(),
        'total_users': User.query.count()
    })
