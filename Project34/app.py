import os
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, flash, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///sheetmusic.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.environ.get('UPLOAD_FOLDER', 'uploads')
app.config['MAX_CONTENT_LENGTH'] = int(os.environ.get('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif'}

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    sheets = db.relationship('SheetMusic', backref='author', lazy=True)
    favorites = db.relationship('Favorite', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(200))
    sheets = db.relationship('SheetMusic', backref='category', lazy=True)


class SheetMusic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    filename = db.Column(db.String(200), nullable=False)
    file_type = db.Column(db.String(10))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    favorites = db.relationship('Favorite', backref='sheet', lazy=True)


class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    sheet_id = db.Column(db.Integer, db.ForeignKey('sheet_music.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    __table_args__ = (db.UniqueConstraint('user_id', 'sheet_id'),)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
def index():
    category_id = request.args.get('category', type=int)
    search = request.args.get('search', '')
    
    query = SheetMusic.query
    
    if category_id:
        query = query.filter_by(category_id=category_id)
    
    if search:
        query = query.filter(SheetMusic.title.ilike(f'%{search}%'))
    
    sheets = query.order_by(SheetMusic.created_at.desc()).all()
    categories = Category.query.all()
    
    return render_template('index.html', sheets=sheets, categories=categories, current_category=category_id, search=search)


@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        
        if User.query.filter_by(username=username).first():
            flash('用户名已存在', 'danger')
            return redirect(url_for('register'))
        
        if User.query.filter_by(email=email).first():
            flash('邮箱已被注册', 'danger')
            return redirect(url_for('register'))
        
        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
        flash('注册成功，请登录', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password):
            login_user(user)
            next_page = request.args.get('next')
            return redirect(next_page or url_for('index'))
        
        flash('用户名或密码错误', 'danger')
    
    return render_template('login.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/upload', methods=['GET', 'POST'])
@login_required
def upload():
    categories = Category.query.all()
    
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('没有选择文件', 'danger')
            return redirect(request.url)
        
        file = request.files['file']
        if file.filename == '':
            flash('没有选择文件', 'danger')
            return redirect(request.url)
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S_')
            filename = timestamp + filename
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            title = request.form.get('title')
            description = request.form.get('description')
            category_id = request.form.get('category_id')
            
            sheet = SheetMusic(
                title=title,
                description=description,
                filename=filename,
                file_type=filename.rsplit('.', 1)[1].lower(),
                user_id=current_user.id,
                category_id=category_id if category_id else None
            )
            db.session.add(sheet)
            db.session.commit()
            
            flash('乐谱上传成功', 'success')
            return redirect(url_for('index'))
        
        flash('不支持的文件格式', 'danger')
    
    return render_template('upload.html', categories=categories)


@app.route('/sheet/<int:sheet_id>')
def sheet_detail(sheet_id):
    sheet = SheetMusic.query.get_or_404(sheet_id)
    is_favorite = False
    if current_user.is_authenticated:
        is_favorite = Favorite.query.filter_by(user_id=current_user.id, sheet_id=sheet_id).first() is not None
    return render_template('sheet_detail.html', sheet=sheet, is_favorite=is_favorite)


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/favorite/<int:sheet_id>', methods=['POST'])
@login_required
def toggle_favorite(sheet_id):
    favorite = Favorite.query.filter_by(user_id=current_user.id, sheet_id=sheet_id).first()
    
    if favorite:
        db.session.delete(favorite)
        flash('已取消收藏', 'info')
    else:
        favorite = Favorite(user_id=current_user.id, sheet_id=sheet_id)
        db.session.add(favorite)
        flash('收藏成功', 'success')
    
    db.session.commit()
    return redirect(request.referrer or url_for('sheet_detail', sheet_id=sheet_id))


@app.route('/favorites')
@login_required
def favorites():
    user_favorites = Favorite.query.filter_by(user_id=current_user.id).all()
    sheets = [fav.sheet for fav in user_favorites]
    return render_template('favorites.html', sheets=sheets)


@app.route('/my-sheets')
@login_required
def my_sheets():
    sheets = SheetMusic.query.filter_by(user_id=current_user.id).order_by(SheetMusic.created_at.desc()).all()
    return render_template('my_sheets.html', sheets=sheets)


@app.route('/delete-sheet/<int:sheet_id>', methods=['POST'])
@login_required
def delete_sheet(sheet_id):
    sheet = SheetMusic.query.get_or_404(sheet_id)
    if sheet.user_id != current_user.id:
        flash('无权删除', 'danger')
        return redirect(url_for('index'))
    
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], sheet.filename)
    if os.path.exists(file_path):
        os.remove(file_path)
    
    Favorite.query.filter_by(sheet_id=sheet_id).delete()
    db.session.delete(sheet)
    db.session.commit()
    
    flash('乐谱已删除', 'success')
    return redirect(url_for('my_sheets'))


def init_categories():
    default_categories = [
        ('钢琴', '钢琴乐谱'),
        ('吉他', '吉他乐谱'),
        ('小提琴', '小提琴乐谱'),
        ('声乐', '声乐曲谱'),
        ('合奏', '合奏乐谱'),
        ('其他', '其他类型乐谱')
    ]
    
    for name, desc in default_categories:
        if not Category.query.filter_by(name=name).first():
            category = Category(name=name, description=desc)
            db.session.add(category)
    
    db.session.commit()


with app.app_context():
    db.create_all()
    try:
        init_categories()
    except:
        pass


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
