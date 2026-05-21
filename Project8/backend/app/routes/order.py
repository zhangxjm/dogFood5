from flask import Blueprint, request
from app import db
from app.models import Order, OrderItem, Earnings, LeaderWallet, Product
from app.utils import jsonify
from datetime import datetime
import random

bp = Blueprint('order', __name__)

@bp.route('/list/<int:leader_id>', methods=['GET'])
def order_list(leader_id):
    page = request.args.get('page', 1, type=int)
    page_size = request.args.get('page_size', 10, type=int)
    status = request.args.get('status', type=int)
    
    query = Order.query.filter_by(leader_id=leader_id)
    if status is not None:
        query = query.filter_by(status=status)
    
    pagination = query.order_by(Order.id.desc()).paginate(page=page, per_page=page_size, error_out=False)
    
    orders = []
    for o in pagination.items:
        orders.append({
            'id': o.id,
            'order_no': o.order_no,
            'user_name': o.user_name,
            'user_phone': o.user_phone,
            'total_amount': float(o.total_amount),
            'commission_amount': float(o.commission_amount),
            'status': o.status,
            'pickup_code': o.pickup_code,
            'created_at': o.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'payment_time': o.payment_time.strftime('%Y-%m-%d %H:%M:%S') if o.payment_time else None,
            'verify_time': o.verify_time.strftime('%Y-%m-%d %H:%M:%S') if o.verify_time else None
        })
    
    return jsonify({
        'code': 200,
        'data': {
            'list': orders,
            'total': pagination.total,
            'page': page,
            'page_size': page_size
        }
    })

@bp.route('/detail/<int:order_id>', methods=['GET'])
def order_detail(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'code': 404, 'message': '订单不存在'})
    
    items = OrderItem.query.filter_by(order_id=order_id).all()
    item_list = []
    for item in items:
        item_list.append({
            'id': item.id,
            'product_id': item.product_id,
            'product_name': item.product_name,
            'product_image': item.product_image,
            'price': float(item.price),
            'quantity': item.quantity,
            'total_price': float(item.total_price),
            'commission_amount': float(item.commission_amount)
        })
    
    return jsonify({
        'code': 200,
        'data': {
            'id': order.id,
            'order_no': order.order_no,
            'user_name': order.user_name,
            'user_phone': order.user_phone,
            'total_amount': float(order.total_amount),
            'commission_amount': float(order.commission_amount),
            'status': order.status,
            'pickup_code': order.pickup_code,
            'remark': order.remark,
            'created_at': order.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'payment_time': order.payment_time.strftime('%Y-%m-%d %H:%M:%S') if order.payment_time else None,
            'verify_time': order.verify_time.strftime('%Y-%m-%d %H:%M:%S') if order.verify_time else None,
            'items': item_list
        }
    })

@bp.route('/verify', methods=['POST'])
def order_verify():
    data = request.get_json()
    leader_id = data.get('leader_id')
    pickup_code = data.get('pickup_code')
    order_id = data.get('order_id')
    
    if not leader_id:
        return jsonify({'code': 400, 'message': '参数不完整'})
    
    order = None
    if order_id:
        order = Order.query.get(order_id)
    elif pickup_code:
        order = Order.query.filter_by(pickup_code=pickup_code, leader_id=leader_id).first()
    
    if not order:
        return jsonify({'code': 404, 'message': '订单不存在'})
    
    if order.leader_id != leader_id:
        return jsonify({'code': 403, 'message': '无权核销该订单'})
    
    if order.status != 1:
        return jsonify({'code': 400, 'message': '订单状态不支持核销'})
    
    order.status = 2
    order.verify_time = datetime.now()
    order.verify_user_id = leader_id
    
    earnings = Earnings.query.filter_by(order_id=order.id).first()
    if earnings:
        earnings.status = 1
        earnings.settle_time = datetime.now()
        
        wallet = LeaderWallet.query.filter_by(leader_id=leader_id).first()
        if wallet:
            wallet.available_balance = wallet.available_balance + earnings.amount
            wallet.total_earnings = wallet.total_earnings + earnings.amount
    
    db.session.commit()
    
    return jsonify({'code': 200, 'message': '核销成功'})

@bp.route('/create', methods=['POST'])
def order_create():
    data = request.get_json()
    leader_id = data.get('leader_id')
    pickup_point_id = data.get('pickup_point_id')
    user_id = data.get('user_id', 1)
    user_name = data.get('user_name', '测试用户')
    user_phone = data.get('user_phone', '13800000000')
    items = data.get('items', [])
    
    if not leader_id or not pickup_point_id or not items:
        return jsonify({'code': 400, 'message': '参数不完整'})
    
    total_amount = 0
    commission_amount = 0
    order_items = []
    
    for item in items:
        product = Product.query.get(item['product_id'])
        if not product:
            continue
        
        quantity = item.get('quantity', 1)
        item_total = float(product.price) * quantity
        item_commission = item_total * float(product.commission_rate) / 100
        
        total_amount += item_total
        commission_amount += item_commission
        
        order_items.append({
            'product_id': product.id,
            'product_name': product.name,
            'product_image': product.image,
            'price': product.price,
            'quantity': quantity,
            'total_price': item_total,
            'commission_rate': product.commission_rate,
            'commission_amount': item_commission
        })
        
        product.sales += quantity
        product.stock -= quantity
    
    order_no = 'SO' + datetime.now().strftime('%Y%m%d%H%M%S') + str(random.randint(1000, 9999))
    pickup_code = str(random.randint(100000, 999999))
    
    order = Order(
        order_no=order_no,
        leader_id=leader_id,
        pickup_point_id=pickup_point_id,
        user_id=user_id,
        user_name=user_name,
        user_phone=user_phone,
        total_amount=total_amount,
        commission_amount=commission_amount,
        status=1,
        payment_time=datetime.now(),
        pickup_code=pickup_code
    )
    
    db.session.add(order)
    db.session.flush()
    
    for item in order_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item['product_id'],
            product_name=item['product_name'],
            product_image=item['product_image'],
            price=item['price'],
            quantity=item['quantity'],
            total_price=item['total_price'],
            commission_rate=item['commission_rate'],
            commission_amount=item['commission_amount']
        )
        db.session.add(order_item)
    
    earnings = Earnings(
        leader_id=leader_id,
        order_id=order.id,
        order_no=order_no,
        amount=commission_amount,
        status=0
    )
    db.session.add(earnings)
    
    db.session.commit()
    
    return jsonify({
        'code': 200,
        'message': '订单创建成功',
        'data': {
            'order_id': order.id,
            'order_no': order_no,
            'pickup_code': pickup_code
        }
    })

@bp.route('/statistics/<int:leader_id>', methods=['GET'])
def order_statistics(leader_id):
    today = datetime.now().date()
    
    total_orders = Order.query.filter_by(leader_id=leader_id).count()
    today_orders = Order.query.filter(Order.leader_id == leader_id, db.func.date(Order.created_at) == today).count()
    pending_orders = Order.query.filter_by(leader_id=leader_id, status=1).count()
    completed_orders = Order.query.filter_by(leader_id=leader_id, status=2).count()
    
    return jsonify({
        'code': 200,
        'data': {
            'total_orders': total_orders,
            'today_orders': today_orders,
            'pending_orders': pending_orders,
            'completed_orders': completed_orders
        }
    })
