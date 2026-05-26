from flask import Blueprint, request, jsonify
from models import db, Course

bp = Blueprint('courses', __name__)

@bp.route('/', methods=['GET'])
def get_courses():
    courses = Course.query.filter_by(is_active=True).all()
    return jsonify([c.to_dict() for c in courses])

@bp.route('/<int:course_id>', methods=['GET'])
def get_course(course_id):
    course = Course.query.get_or_404(course_id)
    return jsonify(course.to_dict())

@bp.route('/', methods=['POST'])
def create_course():
    data = request.json
    course = Course(
        name=data['name'],
        description=data.get('description', ''),
        color=data.get('color', '#1890ff'),
        is_active=True
    )
    db.session.add(course)
    db.session.commit()
    return jsonify(course.to_dict()), 201

@bp.route('/<int:course_id>', methods=['PUT'])
def update_course(course_id):
    course = Course.query.get_or_404(course_id)
    data = request.json
    
    if 'name' in data:
        course.name = data['name']
    if 'description' in data:
        course.description = data['description']
    if 'color' in data:
        course.color = data['color']
    if 'is_active' in data:
        course.is_active = data['is_active']
    
    db.session.commit()
    return jsonify(course.to_dict())

@bp.route('/<int:course_id>', methods=['DELETE'])
def delete_course(course_id):
    course = Course.query.get_or_404(course_id)
    course.is_active = False
    db.session.commit()
    return jsonify({'message': '删除成功'})
