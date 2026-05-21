from flask import Blueprint, request
from app import db
from app.models import Withdrawal, LeaderWallet
from app.utils import jsonify
from datetime import datetime
import random

bp = Blueprint('withdrawal', __name__)

@bp.route('/list/<int:leader_id>', methods=['GET'])
def withdrawal_list(leader_id):
    page = request.args.get('page', 1, type=int)
    page_size = request.args.get('page_size', 10, type=int)
    
    pagination = Withdrawal.query.filter_by(leader_id=leader_id).order_by(Withdrawal.id.desc()).paginate(
        page=page, per_page=page_size, error_out=False
    )
    
    result = []
    for w in pagination.items:
        result.append({
            'id': w.id,
            'withdrawal_no': w.withdrawal_no,
            'amount': float(w.amount),
            'fee': float(w.fee),
            'actual_amount': float(w.actual_amount),
            'account_type': w.account_type,
            'account_name': w.account_name,
            'account_no': w.account_no,
            'bank_name': w.bank_name,
            'status': w.status,
            'audit_remark': w.audit_remark,
            'created_at': w.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'audit_time': w.audit_time.strftime('%Y-%m-%d %H:%M:%S') if w.audit_time else None,
            'pay_time': w.pay_time.strftime('%Y-%m-%d %H:%M:%S') if w.pay_time else None
        })
    
    return jsonify({
        'code': 200,
        'data': {
            'list': result,
            'total': pagination.total,
            'page': page,
            'page_size': page_size
        }
    })

@bp.route('/apply', methods=['POST'])
def withdrawal_apply():
    data = request.get_json()
    leader_id = data.get('leader_id')
    amount = data.get('amount')
    account_type = data.get('account_type', 1)
    account_name = data.get('account_name')
    account_no = data.get('account_no')
    bank_name = data.get('bank_name', '')
    
    if not leader_id or not amount or not account_name or not account_no:
        return jsonify({'code': 400, 'message': '参数不完整'})
    
    amount = float(amount)
    if amount <= 0:
        return jsonify({'code': 400, 'message': '提现金额必须大于0'})
    
    wallet = LeaderWallet.query.filter_by(leader_id=leader_id).first()
    if not wallet or float(wallet.available_balance) < amount:
        return jsonify({'code': 400, 'message': '余额不足'})
    
    fee = 0
    actual_amount = amount - fee
    
    withdrawal_no = 'WD' + datetime.now().strftime('%Y%m%d%H%M%S') + str(random.randint(1000, 9999))
    
    withdrawal = Withdrawal(
        leader_id=leader_id,
        withdrawal_no=withdrawal_no,
        amount=amount,
        fee=fee,
        actual_amount=actual_amount,
        account_type=account_type,
        account_name=account_name,
        account_no=account_no,
        bank_name=bank_name,
        status=0
    )
    
    wallet.available_balance = wallet.available_balance - amount
    wallet.frozen_balance = wallet.frozen_balance + amount
    
    db.session.add(withdrawal)
    db.session.commit()
    
    return jsonify({'code': 200, 'message': '申请成功', 'data': {'withdrawal_no': withdrawal_no}})

@bp.route('/detail/<int:withdrawal_id>', methods=['GET'])
def withdrawal_detail(withdrawal_id):
    withdrawal = Withdrawal.query.get(withdrawal_id)
    if not withdrawal:
        return jsonify({'code': 404, 'message': '提现记录不存在'})
    
    return jsonify({
        'code': 200,
        'data': {
            'id': withdrawal.id,
            'withdrawal_no': withdrawal.withdrawal_no,
            'amount': float(withdrawal.amount),
            'fee': float(withdrawal.fee),
            'actual_amount': float(withdrawal.actual_amount),
            'account_type': withdrawal.account_type,
            'account_name': withdrawal.account_name,
            'account_no': withdrawal.account_no,
            'bank_name': withdrawal.bank_name,
            'status': withdrawal.status,
            'audit_remark': withdrawal.audit_remark,
            'created_at': withdrawal.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'audit_time': withdrawal.audit_time.strftime('%Y-%m-%d %H:%M:%S') if withdrawal.audit_time else None,
            'pay_time': withdrawal.pay_time.strftime('%Y-%m-%d %H:%M:%S') if withdrawal.pay_time else None
        }
    })
