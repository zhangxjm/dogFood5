from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date

db = SQLAlchemy()

class Student(db.Model):
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    parent_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    total_hours = db.Column(db.Integer, default=0)
    used_hours = db.Column(db.Integer, default=0)
    remaining_hours = db.Column(db.Integer, default=0)
    enrollment_date = db.Column(db.Date, default=date.today)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    
    classes = db.relationship('ClassRecord', backref='student', lazy=True)
    schedules = db.relationship('Schedule', backref='student', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'gender': self.gender,
            'age': self.age,
            'parent_name': self.parent_name,
            'phone': self.phone,
            'total_hours': self.total_hours,
            'used_hours': self.used_hours,
            'remaining_hours': self.remaining_hours,
            'enrollment_date': str(self.enrollment_date),
            'created_at': str(self.created_at),
            'updated_at': str(self.updated_at)
        }

class Course(db.Model):
    __tablename__ = 'courses'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, default='')
    color = db.Column(db.String(20), default='#1890ff')
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    schedules = db.relationship('Schedule', backref='course', lazy=True)
    class_records = db.relationship('ClassRecord', backref='course', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'color': self.color,
            'is_active': self.is_active,
            'created_at': str(self.created_at)
        }

class Schedule(db.Model):
    __tablename__ = 'schedules'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    day_of_week = db.Column(db.Integer, nullable=False)
    start_time = db.Column(db.String(10), nullable=False)
    end_time = db.Column(db.String(10), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'student_name': self.student.name if self.student else '',
            'course_id': self.course_id,
            'course_name': self.course.name if self.course else '',
            'course_color': self.course.color if self.course else '#1890ff',
            'day_of_week': self.day_of_week,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'start_date': str(self.start_date),
            'end_date': str(self.end_date) if self.end_date else None,
            'is_active': self.is_active
        }

class ClassRecord(db.Model):
    __tablename__ = 'class_records'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    schedule_id = db.Column(db.Integer, db.ForeignKey('schedules.id'))
    class_date = db.Column(db.Date, nullable=False, default=date.today)
    start_time = db.Column(db.String(10), nullable=False)
    end_time = db.Column(db.String(10), nullable=False)
    hours = db.Column(db.Integer, default=1)
    status = db.Column(db.String(20), default='completed')
    notes = db.Column(db.Text, default='')
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'student_name': self.student.name if self.student else '',
            'course_id': self.course_id,
            'course_name': self.course.name if self.course else '',
            'schedule_id': self.schedule_id,
            'class_date': str(self.class_date),
            'start_time': self.start_time,
            'end_time': self.end_time,
            'hours': self.hours,
            'status': self.status,
            'notes': self.notes,
            'created_at': str(self.created_at)
        }
