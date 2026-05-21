from flask import Blueprint, request
from app import db
from app.models import Earnings, LeaderWallet
from app.utils import jsonify
from datetime import datetime

bp = Blueprint('earnings', __name__)

@bp.route('/list/<int:leader_id>', methods=['GET'])
def earnings_list(leader_id):
    page = request.args.get('page', 1, type=int)
    page_size = request.args.get('page_size', 10, type=int)
    
    pagination = Earnings.query.filter_by(leader_id=leader_id).order_by(Earnings.id.desc()).paginate(
        page=page, per_page=page_size, error_out=False
    )
    
    result = []
    for e in pagination.items:
        result.append({
            'id': e.id,
            'order_no': e.order_no,
            'amount': float(e.amount),
            'type': e.type,
            'status': e.status,
            'remark': e.remark,
            'created_at': e.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'settle_time': e.settle_time.strftime('%Y-%m-%d %H:%M:%S') if e.settle_time else None
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

@bp.route('/statistics/<int:leader_id>', methods=['GET'])
def earnings_statistics(leader_id):
    today = datetime.now().date()
    month = datetime.now().month
    year = datetime.now().year
    
    total_earnings = db.session.query(db.func.sum(Earnings.amount)).filter_by(leader_id=leader_id, status=1).scalar() or 0
    
    today_earnings = db.session.query(db.func.sum(Earnings.amount)).filter(
        Earnings.leader_id == leader_id,
        Earnings.status == 1,
        db.func.date(Earnings.settle_time) == today
    ).scalar() or 0
    
    month_earnings = db.session.query(db.func.sum(Earnings.amount)).filter(
        Earnings.leader_id == leader_id,
        Earnings.status == 1,
        db.func.extract('month', Earnings.settle_time) == month,
        db.func.extract('year', Earnings.settle_time) == year
    ).scalar() or 0
    
    pending_earnings = db.session.query(db.func.sum(Earnings.amount)).filter_by(leader_id=leader_id, status=0).scalar() or 0
    
    wallet = LeaderWallet.query.filter_by(leader_id=leader_id).first()
    
    return jsonify({
        'code': 200,
        'data': {
            'total_earnings': float(total_earnings),
            'today_earnings': float(today_earnings),
            'month_earnings': float(month_earnings),
            'pending_earnings': float(pending_earnings),
            'available_balance': float(wallet.available_balance) if wallet else 0
        }
    })
