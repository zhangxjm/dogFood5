from flask import Blueprint, request, jsonify
from models import db, Schedule
from datetime import datetime

bp = Blueprint('schedules', __name__)

@bp.route('/', methods=['GET'])
def get_schedules():
    student_id = request.args.get('student_id', type=int)
    course_id = request.args.get('course_id', type=int)
    
    query = Schedule.query.filter_by(is_active=True)
    
    if student_id:
        query = query.filter_by(student_id=student_id)
    if course_id:
        query = query.filter_by(course_id=course_id)
    
    schedules = query.all()
    return jsonify([s.to_dict() for s in schedules])

@bp.route('/<int:schedule_id>', methods=['GET'])
def get_schedule(schedule_id):
    schedule = Schedule.query.get_or_404(schedule_id)
    return jsonify(schedule.to_dict())

@bp.route('/', methods=['POST'])
def create_schedule():
    data = request.json
    schedule = Schedule(
        student_id=data['student_id'],
        course_id=data['course_id'],
        day_of_week=data['day_of_week'],
        start_time=data['start_time'],
        end_time=data['end_time'],
        start_date=datetime.strptime(data['start_date'], '%Y-%m-%d').date(),
        end_date=datetime.strptime(data['end_date'], '%Y-%m-%d').date() if data.get('end_date') else None,
        is_active=True
    )
    db.session.add(schedule)
    db.session.commit()
    return jsonify(schedule.to_dict()), 201

@bp.route('/<int:schedule_id>', methods=['PUT'])
def update_schedule(schedule_id):
    schedule = Schedule.query.get_or_404(schedule_id)
    data = request.json
    
    if 'day_of_week' in data:
        schedule.day_of_week = data['day_of_week']
    if 'start_time' in data:
        schedule.start_time = data['start_time']
    if 'end_time' in data:
        schedule.end_time = data['end_time']
    if 'start_date' in data:
        schedule.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
    if 'end_date' in data:
        schedule.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date() if data['end_date'] else None
    if 'is_active' in data:
        schedule.is_active = data['is_active']
    
    db.session.commit()
    return jsonify(schedule.to_dict())

@bp.route('/<int:schedule_id>', methods=['DELETE'])
def delete_schedule(schedule_id):
    schedule = Schedule.query.get_or_404(schedule_id)
    schedule.is_active = False
    db.session.commit()
    return jsonify({'message': '删除成功'})

@bp.route('/weekly', methods=['GET'])
def get_weekly_schedule():
    schedules = Schedule.query.filter_by(is_active=True).all()
    result = {}
    for s in schedules:
        day = str(s.day_of_week)
        if day not in result:
            result[day] = []
        result[day].append(s.to_dict())
    return jsonify(result)
