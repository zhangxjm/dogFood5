from flask import Blueprint, request
from app import db
from app.models import Product, Category
from app.utils import jsonify

bp = Blueprint('product', __name__)

@bp.route('/list/<int:leader_id>', methods=['GET'])
def product_list(leader_id):
    page = request.args.get('page', 1, type=int)
    page_size = request.args.get('page_size', 10, type=int)
    status = request.args.get('status', type=int)
    
    query = Product.query.filter_by(leader_id=leader_id)
    if status is not None:
        query = query.filter_by(status=status)
    
    pagination = query.order_by(Product.id.desc()).paginate(page=page, per_page=page_size, error_out=False)
    
    products = []
    for p in pagination.items:
        products.append({
            'id': p.id,
            'name': p.name,
            'image': p.image,
            'price': float(p.price),
            'stock': p.stock,
            'sales': p.sales,
            'status': p.status,
            'unit': p.unit,
            'commission_rate': float(p.commission_rate)
        })
    
    return jsonify({
        'code': 200,
        'data': {
            'list': products,
            'total': pagination.total,
            'page': page,
            'page_size': page_size
        }
    })

@bp.route('/detail/<int:product_id>', methods=['GET'])
def product_detail(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'code': 404, 'message': '商品不存在'})
    
    return jsonify({
        'code': 200,
        'data': {
            'id': product.id,
            'name': product.name,
            'image': product.image,
            'images': product.images,
            'price': float(product.price),
            'cost_price': float(product.cost_price),
            'commission_rate': float(product.commission_rate),
            'stock': product.stock,
            'sales': product.sales,
            'unit': product.unit,
            'description': product.description,
            'category_id': product.category_id,
            'status': product.status
        }
    })

@bp.route('/add', methods=['POST'])
def product_add():
    data = request.get_json()
    leader_id = data.get('leader_id')
    name = data.get('name')
    price = data.get('price')
    
    if not leader_id or not name or not price:
        return jsonify({'code': 400, 'message': '参数不完整'})
    
    product = Product(
        leader_id=leader_id,
        name=name,
        price=price,
        category_id=data.get('category_id', 0),
        image=data.get('image', ''),
        images=data.get('images', ''),
        cost_price=data.get('cost_price', 0),
        commission_rate=data.get('commission_rate', 10.00),
        stock=data.get('stock', 0),
        unit=data.get('unit', '件'),
        description=data.get('description', ''),
        status=1
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify({'code': 200, 'message': '添加成功', 'data': {'id': product.id}})

@bp.route('/edit/<int:product_id>', methods=['PUT'])
def product_edit(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'code': 404, 'message': '商品不存在'})
    
    data = request.get_json()
    
    if data.get('name'):
        product.name = data.get('name')
    if data.get('price') is not None:
        product.price = data.get('price')
    if data.get('category_id') is not None:
        product.category_id = data.get('category_id')
    if data.get('image') is not None:
        product.image = data.get('image')
    if data.get('cost_price') is not None:
        product.cost_price = data.get('cost_price')
    if data.get('commission_rate') is not None:
        product.commission_rate = data.get('commission_rate')
    if data.get('stock') is not None:
        product.stock = data.get('stock')
    if data.get('unit'):
        product.unit = data.get('unit')
    if data.get('description') is not None:
        product.description = data.get('description')
    
    db.session.commit()
    
    return jsonify({'code': 200, 'message': '修改成功'})

@bp.route('/status/<int:product_id>', methods=['PUT'])
def product_status(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'code': 404, 'message': '商品不存在'})
    
    data = request.get_json()
    product.status = data.get('status', 1)
    db.session.commit()
    
    return jsonify({'code': 200, 'message': '状态修改成功'})

@bp.route('/categories', methods=['GET'])
def categories():
    categories = Category.query.filter_by(status=1).order_by(Category.sort_order).all()
    result = [{'id': c.id, 'name': c.name} for c in categories]
    return jsonify({'code': 200, 'data': result})
