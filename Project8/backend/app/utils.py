from flask import jsonify as flask_jsonify
import json

def jsonify(data):
    response = flask_jsonify(data)
    response.data = json.dumps(data, ensure_ascii=False).encode('utf-8')
    response.content_type = 'application/json; charset=utf-8'
    return response

def success(data=None, message='success'):
    return jsonify({
        'code': 200,
        'message': message,
        'data': data
    })

def error(message, code=400):
    return jsonify({
        'code': code,
        'message': message,
        'data': None
    })
