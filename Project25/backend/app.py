from flask import Flask
from flask_cors import CORS
from models import db
import os
import random

app = Flask(__name__)
CORS(app)

app.config.from_object('config.Config')

db.init_app(app)

with app.app_context():
    from routes import students, courses, schedules, classes
    app.register_blueprint(students.bp, url_prefix='/api/students')
    app.register_blueprint(courses.bp, url_prefix='/api/courses')
    app.register_blueprint(schedules.bp, url_prefix='/api/schedules')
    app.register_blueprint(classes.bp, url_prefix='/api/classes')

@app.route('/api/health')
def health_check():
    return {'status': 'ok', 'message': '少儿绘画课时记录系统运行正常'}

if __name__ == '__main__':
    port = int(os.getenv('BACKEND_PORT', random.randint(10000, 65000)))
    print(f'后端服务启动在端口: {port}')
    app.run(host='0.0.0.0', port=port, debug=False)
