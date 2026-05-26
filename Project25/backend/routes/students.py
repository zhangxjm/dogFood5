from flask import Blueprint, request, jsonify
from models import db, Student, Schedule, ClassRecord
from datetime import datetime

bp = Blueprint('students', __name__)

@bp.route('/', methods=['GET'])
def get_students():
    students = Student.query.all()
    return jsonify([s.to_dict() for s in students])

@bp.route('/<int:student_id>', methods=['GET'])
def get_student(student_id):
    student = Student.query.get_or_404(student_id)
    return jsonify(student.to_dict())

@bp.route('/', methods=['POST'])
def create_student():
    data = request.json
    student = Student(
        name=data['name'],
        gender=data['gender'],
        age=data['age'],
        parent_name=data['parent_name'],
        phone=data['phone'],
        total_hours=data.get('total_hours', 0),
        used_hours=0,
        remaining_hours=data.get('total_hours', 0),
        enrollment_date=datetime.strptime(data.get('enrollment_date', str(datetime.now().date())), '%Y-%m-%d').date()
    )
    db.session.add(student)
    db.session.commit()
    return jsonify(student.to_dict()), 201

@bp.route('/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    student = Student.query.get_or_404(student_id)
    data = request.json
    
    if 'name' in data:
        student.name = data['name']
    if 'gender' in data:
        student.gender = data['gender']
    if 'age' in data:
        student.age = data['age']
    if 'parent_name' in data:
        student.parent_name = data['parent_name']
    if 'phone' in data:
        student.phone = data['phone']
    if 'total_hours' in data:
        new_total = data['total_hours']
        diff = new_total - student.total_hours
        student.total_hours = new_total
        student.remaining_hours += diff
    if 'enrollment_date' in data:
        student.enrollment_date = datetime.strptime(data['enrollment_date'], '%Y-%m-%d').date()
    
    student.updated_at = datetime.now()
    db.session.commit()
    return jsonify(student.to_dict())

@bp.route('/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    student = Student.query.get_or_404(student_id)
    
    ClassRecord.query.filter_by(student_id=student_id).delete()
    
    Schedule.query.filter_by(student_id=student_id).delete()
    
    db.session.delete(student)
    db.session.commit()
    return jsonify({'message': '删除成功'})

@bp.route('/stats', methods=['GET'])
def get_students_stats():
    students = Student.query.all()
    total_students = len(students)
    total_hours = sum(s.total_hours for s in students)
    used_hours = sum(s.used_hours for s in students)
    remaining_hours = sum(s.remaining_hours for s in students)
    low_hours = sum(1 for s in students if s.remaining_hours <= 5)
    
    return jsonify({
        'total_students': total_students,
        'total_hours': total_hours,
        'used_hours': used_hours,
        'remaining_hours': remaining_hours,
        'low_hours_students': low_hours
    })
