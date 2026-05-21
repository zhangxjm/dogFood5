from flask import Blueprint, request
from app import db
from app.models import Leader, LeaderWallet
from app.utils import jsonify
import hashlib

bp = Blueprint('auth', __name__)

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    phone = data.get('phone')
    password = data.get('password')
    
    if not phone or not password:
        return jsonify({'code': 400, 'message': '手机号和密码不能为空'})
    
    md5_password = hashlib.md5(password.encode()).hexdigest()
    leader = Leader.query.filter_by(phone=phone, password=md5_password).first()
    
    if not leader:
        return jsonify({'code': 401, 'message': '手机号或密码错误'})
    
    if leader.status != 1:
        return jsonify({'code': 403, 'message': '账号已被禁用'})
    
    return jsonify({
        'code': 200,
        'message': '登录成功',
        'data': {
            'id': leader.id,
            'name': leader.name,
            'phone': leader.phone,
            'avatar': leader.avatar
        }
    })

@bp.route('/profile/<int:leader_id>', methods=['GET'])
def profile(leader_id):
    leader = Leader.query.get(leader_id)
    if not leader:
        return jsonify({'code': 404, 'message': '用户不存在'})
    
    wallet = LeaderWallet.query.filter_by(leader_id=leader_id).first()
    
    return jsonify({
        'code': 200,
        'data': {
            'id': leader.id,
            'name': leader.name,
            'phone': leader.phone,
            'avatar': leader.avatar,
            'wallet': {
                'total_earnings': float(wallet.total_earnings) if wallet else 0,
                'available_balance': float(wallet.available_balance) if wallet else 0,
                'frozen_balance': float(wallet.frozen_balance) if wallet else 0,
                'total_withdrawal': float(wallet.total_withdrawal) if wallet else 0
            } if wallet else None
        }
    })
