import os
import uuid
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image
import redis

from config import Config
from models import db, Category, Artwork

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app)

r = redis.Redis.from_url(app.config['REDIS_URL'])

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
def index():
    return jsonify({'message': '书画作品展示平台 API'})

@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([c.to_dict() for c in categories])

@app.route('/api/categories', methods=['POST'])
def create_category():
    data = request.json
    if not data or 'name' not in data:
        return jsonify({'error': '缺少分类名称'}), 400
    
    if Category.query.filter_by(name=data['name']).first():
        return jsonify({'error': '分类已存在'}), 400
    
    category = Category(
        name=data['name'],
        description=data.get('description', '')
    )
    db.session.add(category)
    db.session.commit()
    return jsonify(category.to_dict()), 201

@app.route('/api/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    category = Category.query.get_or_404(category_id)
    if Artwork.query.filter_by(category_id=category_id).first():
        return jsonify({'error': '该分类下还有作品，无法删除'}), 400
    db.session.delete(category)
    db.session.commit()
    return jsonify({'message': '删除成功'})

@app.route('/api/artworks', methods=['GET'])
def get_artworks():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)
    category_id = request.args.get('category_id', type=int)
    sort_by = request.args.get('sort_by', 'created_at')
    
    query = Artwork.query
    
    if category_id:
        query = query.filter_by(category_id=category_id)
    
    if sort_by == 'likes':
        query = query.order_by(Artwork.likes.desc())
    elif sort_by == 'views':
        query = query.order_by(Artwork.views.desc())
    else:
        query = query.order_by(Artwork.created_at.desc())
    
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'artworks': [a.to_dict() for a in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    })

@app.route('/api/artworks/<int:artwork_id>', methods=['GET'])
def get_artwork(artwork_id):
    artwork = Artwork.query.get_or_404(artwork_id)
    artwork.views += 1
    db.session.commit()
    return jsonify(artwork.to_dict())

@app.route('/api/artworks', methods=['POST'])
def create_artwork():
    if 'image' not in request.files:
        return jsonify({'error': '没有上传图片'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': '没有选择文件'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': '不支持的文件格式'}), 400
    
    title = request.form.get('title')
    category_id = request.form.get('category_id', type=int)
    
    if not title or not category_id:
        return jsonify({'error': '缺少标题或分类'}), 400
    
    category = Category.query.get(category_id)
    if not category:
        return jsonify({'error': '分类不存在'}), 400
    
    ext = secure_filename(file.filename).rsplit('.', 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    file.save(filepath)
    
    try:
        with Image.open(filepath) as img:
            max_size = 1920
            if img.width > max_size or img.height > max_size:
                img.thumbnail((max_size, max_size))
                img.save(filepath, optimize=True, quality=85)
    except Exception as e:
        os.remove(filepath)
        return jsonify({'error': '图片处理失败'}), 400
    
    artwork = Artwork(
        title=title,
        description=request.form.get('description', ''),
        author=request.form.get('author', ''),
        image_path=f"/uploads/{filename}",
        category_id=category_id
    )
    
    db.session.add(artwork)
    db.session.commit()
    
    return jsonify(artwork.to_dict()), 201

@app.route('/api/artworks/<int:artwork_id>', methods=['PUT'])
def update_artwork(artwork_id):
    artwork = Artwork.query.get_or_404(artwork_id)
    data = request.json
    
    if 'title' in data:
        artwork.title = data['title']
    if 'description' in data:
        artwork.description = data['description']
    if 'author' in data:
        artwork.author = data['author']
    if 'category_id' in data:
        if Category.query.get(data['category_id']):
            artwork.category_id = data['category_id']
    
    db.session.commit()
    return jsonify(artwork.to_dict())

@app.route('/api/artworks/<int:artwork_id>', methods=['DELETE'])
def delete_artwork(artwork_id):
    artwork = Artwork.query.get_or_404(artwork_id)
    
    if artwork.image_path:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], os.path.basename(artwork.image_path))
        if os.path.exists(filepath):
            os.remove(filepath)
    
    db.session.delete(artwork)
    db.session.commit()
    return jsonify({'message': '删除成功'})

@app.route('/api/artworks/<int:artwork_id>/like', methods=['POST'])
def like_artwork(artwork_id):
    artwork = Artwork.query.get_or_404(artwork_id)
    
    client_ip = request.remote_addr
    like_key = f"like:{artwork_id}:{client_ip}"
    
    if r.get(like_key):
        return jsonify({'error': '您已经点过赞了', 'likes': artwork.likes}), 400
    
    artwork.likes += 1
    db.session.commit()
    
    r.setex(like_key, 86400, '1')
    
    return jsonify({'likes': artwork.likes})

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

with app.app_context():
    db.create_all()
    
    if not Category.query.first():
        default_categories = [
            {'name': '书法', 'description': '传统书法作品展示'},
            {'name': '国画', 'description': '中国传统绘画作品'},
            {'name': '油画', 'description': '西方油画艺术作品'},
            {'name': '水彩', 'description': '水彩画作品展示'},
            {'name': '素描', 'description': '素描速写作品'}
        ]
        
        for cat in default_categories:
            category = Category(**cat)
            db.session.add(category)
        db.session.commit()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
