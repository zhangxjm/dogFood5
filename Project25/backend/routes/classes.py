from flask import Blueprint, request, jsonify
from models import db, ClassRecord, Student
from datetime import datetime, date, timedelta

bp = Blueprint('classes', __name__)

@bp.route('/', methods=['GET'])
def get_classes():
    student_id = request.args.get('student_id', type=int)
    course_id = request.args.get('course_id', type=int)
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = ClassRecord.query
    
    if student_id:
        query = query.filter_by(student_id=student_id)
    if course_id:
        query = query.filter_by(course_id=course_id)
    if start_date:
        query = query.filter(ClassRecord.class_date >= datetime.strptime(start_date, '%Y-%m-%d').date())
    if end_date:
        query = query.filter(ClassRecord.class_date <= datetime.strptime(end_date, '%Y-%m-%d').date())
    
    classes = query.order_by(ClassRecord.class_date.desc()).all()
    return jsonify([c.to_dict() for c in classes])

@bp.route('/<int:class_id>', methods=['GET'])
def get_class(class_id):
    cls = ClassRecord.query.get_or_404(class_id)
    return jsonify(cls.to_dict())

@bp.route('/', methods=['POST'])
def create_class():
    data = request.json
    hours = data.get('hours', 1)
    
    student = Student.query.get(data['student_id'])
    if not student:
        return jsonify({'error': '学员不存在'}), 404
    
    if student.remaining_hours < hours:
        return jsonify({'error': '剩余课时不足'}), 400
    
    cls = ClassRecord(
        student_id=data['student_id'],
        course_id=data['course_id'],
        schedule_id=data.get('schedule_id'),
        class_date=datetime.strptime(data.get('class_date', str(date.today())), '%Y-%m-%d').date(),
        start_time=data['start_time'],
        end_time=data['end_time'],
        hours=hours,
        status=data.get('status', 'completed'),
        notes=data.get('notes', '')
    )
    
    student.used_hours += hours
    student.remaining_hours -= hours
    
    db.session.add(cls)
    db.session.commit()
    return jsonify(cls.to_dict()), 201

@bp.route('/<int:class_id>', methods=['PUT'])
def update_class(class_id):
    cls = ClassRecord.query.get_or_404(class_id)
    data = request.json
    
    old_hours = cls.hours
    new_hours = data.get('hours', old_hours)
    diff = new_hours - old_hours
    
    student = Student.query.get(cls.student_id)
    
    if diff > 0 and student.remaining_hours < diff:
        return jsonify({'error': '剩余课时不足'}), 400
    
    student.used_hours += diff
    student.remaining_hours -= diff
    
    if 'course_id' in data:
        cls.course_id = data['course_id']
    if 'class_date' in data:
        cls.class_date = datetime.strptime(data['class_date'], '%Y-%m-%d').date()
    if 'start_time' in data:
        cls.start_time = data['start_time']
    if 'end_time' in data:
        cls.end_time = data['end_time']
    if 'hours' in data:
        cls.hours = data['hours']
    if 'status' in data:
        cls.status = data['status']
    if 'notes' in data:
        cls.notes = data['notes']
    
    db.session.commit()
    return jsonify(cls.to_dict())

@bp.route('/<int:class_id>', methods=['DELETE'])
def delete_class(class_id):
    cls = ClassRecord.query.get_or_404(class_id)
    student = Student.query.get(cls.student_id)
    
    if cls.status == 'completed':
        student.used_hours -= cls.hours
        student.remaining_hours += cls.hours
    
    db.session.delete(cls)
    db.session.commit()
    return jsonify({'message': '删除成功'})

@bp.route('/stats/monthly', methods=['GET'])
def get_monthly_stats():
    today = date.today()
    first_day = today.replace(day=1)
    
    classes = ClassRecord.query.filter(
        ClassRecord.class_date >= first_day,
        ClassRecord.status == 'completed'
    ).all()
    
    total_classes = len(classes)
    total_hours = sum(c.hours for c in classes)
    
    student_stats = {}
    for c in classes:
        sid = c.student_id
        if sid not in student_stats:
            student_stats[sid] = {
                'student_id': sid,
                'student_name': c.student.name if c.student else '',
                'classes': 0,
                'hours': 0
            }
        student_stats[sid]['classes'] += 1
        student_stats[sid]['hours'] += c.hours
    
    return jsonify({
        'total_classes': total_classes,
        'total_hours': total_hours,
        'student_stats': list(student_stats.values())
    })
