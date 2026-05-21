from flask import Blueprint, request
from app import db
from app.models import PickupPoint
from app.utils import jsonify

bp = Blueprint('pickup', __name__)

@bp.route('/list/<int:leader_id>', methods=['GET'])
def pickup_list(leader_id):
    points = PickupPoint.query.filter_by(leader_id=leader_id).order_by(PickupPoint.id.desc()).all()
    
    result = []
    for p in points:
        result.append({
            'id': p.id,
            'name': p.name,
            'address': p.address,
            'province': p.province,
            'city': p.city,
            'district': p.district,
            'contact_name': p.contact_name,
            'contact_phone': p.contact_phone,
            'business_hours': p.business_hours,
            'status': p.status
        })
    
    return jsonify({'code': 200, 'data': result})

@bp.route('/detail/<int:point_id>', methods=['GET'])
def pickup_detail(point_id):
    point = PickupPoint.query.get(point_id)
    if not point:
        return jsonify({'code': 404, 'message': '自提点不存在'})
    
    return jsonify({
        'code': 200,
        'data': {
            'id': point.id,
            'name': point.name,
            'address': point.address,
            'province': point.province,
            'city': point.city,
            'district': point.district,
            'contact_name': point.contact_name,
            'contact_phone': point.contact_phone,
            'business_hours': point.business_hours,
            'status': point.status
        }
    })

@bp.route('/add', methods=['POST'])
def pickup_add():
    data = request.get_json()
    leader_id = data.get('leader_id')
    name = data.get('name')
    address = data.get('address')
    contact_name = data.get('contact_name')
    contact_phone = data.get('contact_phone')
    
    if not leader_id or not name or not address or not contact_name or not contact_phone:
        return jsonify({'code': 400, 'message': '参数不完整'})
    
    point = PickupPoint(
        leader_id=leader_id,
        name=name,
        address=address,
        province=data.get('province', ''),
        city=data.get('city', ''),
        district=data.get('district', ''),
        contact_name=contact_name,
        contact_phone=contact_phone,
        business_hours=data.get('business_hours', ''),
        status=1
    )
    
    db.session.add(point)
    db.session.commit()
    
    return jsonify({'code': 200, 'message': '添加成功', 'data': {'id': point.id}})

@bp.route('/edit/<int:point_id>', methods=['PUT'])
def pickup_edit(point_id):
    point = PickupPoint.query.get(point_id)
    if not point:
        return jsonify({'code': 404, 'message': '自提点不存在'})
    
    data = request.get_json()
    
    if data.get('name'):
        point.name = data.get('name')
    if data.get('address'):
        point.address = data.get('address')
    if data.get('province') is not None:
        point.province = data.get('province')
    if data.get('city') is not None:
        point.city = data.get('city')
    if data.get('district') is not None:
        point.district = data.get('district')
    if data.get('contact_name'):
        point.contact_name = data.get('contact_name')
    if data.get('contact_phone'):
        point.contact_phone = data.get('contact_phone')
    if data.get('business_hours') is not None:
        point.business_hours = data.get('business_hours')
    
    db.session.commit()
    
    return jsonify({'code': 200, 'message': '修改成功'})

@bp.route('/status/<int:point_id>', methods=['PUT'])
def pickup_status(point_id):
    point = PickupPoint.query.get(point_id)
    if not point:
        return jsonify({'code': 404, 'message': '自提点不存在'})
    
    data = request.get_json()
    point.status = data.get('status', 1)
    db.session.commit()
    
    return jsonify({'code': 200, 'message': '状态修改成功'})
