from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    
    db_url = os.getenv('DATABASE_URL', 'mysql+pymysql://groupbuy:groupbuy123@localhost:3306/groupbuy')
    if 'charset=' not in db_url:
        if '?' in db_url:
            db_url += '&charset=utf8mb4'
        else:
            db_url += '?charset=utf8mb4'
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'groupbuy-secret-key-2024')
    app.config['JSON_AS_ASCII'] = False
    app.config['JSONIFY_MIMETYPE'] = 'application/json; charset=utf-8'
    
    CORS(app)
    db.init_app(app)
    
    from app.routes import auth, product, order, pickup, earnings, withdrawal
    app.register_blueprint(auth.bp, url_prefix='/api/auth')
    app.register_blueprint(product.bp, url_prefix='/api/product')
    app.register_blueprint(order.bp, url_prefix='/api/order')
    app.register_blueprint(pickup.bp, url_prefix='/api/pickup')
    app.register_blueprint(earnings.bp, url_prefix='/api/earnings')
    app.register_blueprint(withdrawal.bp, url_prefix='/api/withdrawal')
    
    return app
