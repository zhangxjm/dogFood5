import os
import sys
from init_data import init_data
from app import app
import random

if __name__ == '__main__':
    print('正在初始化数据库...')
    init_data(app)
    
    port = int(os.getenv('BACKEND_PORT', random.randint(10000, 65000)))
    print(f'后端服务启动在端口: {port}')
    app.run(host='0.0.0.0', port=port, debug=False)
