import os
import sys
import random
import subprocess
import time
import socket
import threading
import http.server
import socketserver
from pathlib import Path

BASE_DIR = Path(__file__).parent.absolute()
BACKEND_DIR = BASE_DIR / 'backend'
FRONTEND_DIR = BASE_DIR / 'frontend'

def get_random_port():
    while True:
        port = random.randint(10000, 65000)
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(('localhost', port))
                return port
            except OSError:
                continue

def check_port(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.settimeout(1)
            s.connect(('localhost', port))
            return True
        except (ConnectionRefusedError, OSError):
            return False

def wait_for_port(port, timeout=30):
    start = time.time()
    while time.time() - start < timeout:
        if check_port(port):
            return True
        time.sleep(1)
    return False

def setup_database(db_port):
    print('[数据库] 检查Docker容器...')
    
    result = subprocess.run(
        ['docker', 'ps', '-a', '--filter', 'name=art-lesson-db', '--format', '{{.Names}}'],
        capture_output=True, text=True
    )
    
    if 'art-lesson-db' not in result.stdout:
        print('[数据库] 创建PostgreSQL容器...')
        
        docker_compose = f"""version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: art-lesson-db
    environment:
      POSTGRES_USER: art_user
      POSTGRES_PASSWORD: art_pass_2024
      POSTGRES_DB: art_lesson
    ports:
      - "{db_port}:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U art_user -d art_lesson"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
"""
        with open(BASE_DIR / 'docker-compose.yml', 'w', encoding='utf-8') as f:
            f.write(docker_compose)
        
        subprocess.run(['docker', 'compose', 'up', '-d'], cwd=BASE_DIR, capture_output=True)
    else:
        result = subprocess.run(
            ['docker', 'ps', '--filter', 'name=art-lesson-db', '--format', '{{.Names}}'],
            capture_output=True, text=True
        )
        
        if 'art-lesson-db' not in result.stdout:
            print('[数据库] 启动数据库容器...')
            subprocess.run(['docker', 'start', 'art-lesson-db'], capture_output=True)
        else:
            print('[数据库] 容器已在运行')
        
        result = subprocess.run(
            ['docker', 'port', 'art-lesson-db', '5432'],
            capture_output=True, text=True
        )
        if result.stdout:
            for line in result.stdout.strip().split('\n'):
                if ':' in line:
                    parts = line.split(':')
                    db_port = int(parts[-1].strip())
                    print(f'[数据库] 实际端口: {db_port}')
    
    print('[数据库] 等待就绪...')
    if wait_for_port(db_port):
        print('[数据库] 已就绪!')
    else:
        print('[数据库] 警告: 可能未完全就绪')
    
    return db_port

def setup_backend(db_port, backend_port):
    print('[后端] 检查依赖...')
    
    venv_dir = BACKEND_DIR / 'venv'
    if not venv_dir.exists():
        print('[后端] 创建虚拟环境...')
        subprocess.run([sys.executable, '-m', 'venv', str(venv_dir)], cwd=BACKEND_DIR)
        
        pip_path = venv_dir / 'Scripts' / 'pip.exe'
        print('[后端] 安装依赖...')
        subprocess.run([str(pip_path), 'install', '-r', 'requirements.txt'], cwd=BACKEND_DIR)
    
    python_path = venv_dir / 'Scripts' / 'python.exe'
    
    print('[后端] 初始化数据库...')
    env = os.environ.copy()
    env['DB_HOST'] = 'localhost'
    env['DB_PORT'] = str(db_port)
    
    result = subprocess.run(
        [str(python_path), '-c', 'from init_data import init_data; from app import app; init_data(app)'],
        cwd=BACKEND_DIR, capture_output=True, text=True, env=env
    )
    if result.returncode == 0:
        print('[后端] 数据库初始化完成')
    else:
        print(f'[后端] 初始化警告: {result.stderr}')
    
    return python_path, env

def start_backend(python_path, backend_port, env):
    print(f'[后端] 启动服务 (端口: {backend_port})...')
    
    env['BACKEND_PORT'] = str(backend_port)
    
    process = subprocess.Popen(
        [str(python_path), 'app.py'],
        cwd=BACKEND_DIR,
        env=env
    )
    
    if wait_for_port(backend_port, timeout=15):
        print(f'[后端] 服务已启动: http://localhost:{backend_port}')
    else:
        print('[后端] 警告: 启动可能失败')
    
    return process

def start_frontend(frontend_port, backend_port):
    print(f'[前端] 启动服务 (端口: {frontend_port})...')
    
    server_code = f'''import http.server
import socketserver
import os
import sys

PORT = {frontend_port}
BACKEND_PORT = {backend_port}
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()
    
    def do_GET(self):
        if self.path == '/config.js':
            content = f'window.API_BASE = "http://localhost:{{BACKEND_PORT}}";'
            self.send_response(200)
            self.send_header('Content-Type', 'application/javascript')
            self.send_header('Content-Length', len(content))
            self.end_headers()
            self.wfile.write(content.encode())
            return
        super().do_GET()

os.chdir(DIRECTORY)

with socketserver.TCPServer(('', PORT), MyHTTPRequestHandler) as httpd:
    print(f'前端服务运行在: http://localhost:{{PORT}}')
    print(f'后端服务地址: http://localhost:{{BACKEND_PORT}}')
    httpd.serve_forever()
'''
    
    server_path = FRONTEND_DIR / 'server.py'
    with open(server_path, 'w', encoding='utf-8') as f:
        f.write(server_code)
    
    process = subprocess.Popen(
        [sys.executable, str(server_path)],
        cwd=FRONTEND_DIR
    )
    
    if wait_for_port(frontend_port, timeout=10):
        print(f'[前端] 服务已启动: http://localhost:{frontend_port}')
    else:
        print('[前端] 警告: 启动可能失败')
    
    return process

def main():
    print('=' * 50)
    print('  少儿绘画课时记录系统')
    print('=' * 50)
    print()
    
    db_port = get_random_port()
    backend_port = get_random_port()
    frontend_port = get_random_port()
    
    print('[信息] 分配端口:')
    print(f'       数据库: {db_port}')
    print(f'       后端: {backend_port}')
    print(f'       前端: {frontend_port}')
    print()
    
    try:
        db_port = setup_database(db_port)
        python_path, env = setup_backend(db_port, backend_port)
        backend_process = start_backend(python_path, backend_port, env)
        frontend_process = start_frontend(frontend_port, backend_port)
        
        print()
        print('=' * 50)
        print('  系统启动完成!')
        print('=' * 50)
        print()
        print(f'  前端地址: http://localhost:{frontend_port}')
        print(f'  后端地址: http://localhost:{backend_port}')
        print(f'  数据库端口: {db_port}')
        print()
        print('  初始数据已创建:')
        print('    - 12个学员')
        print('    - 6门课程')
        print('    - 12个排班')
        print('    - 多条上课记录')
        print()
        print('  按 Ctrl+C 停止服务')
        print()
        
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print()
            print('[信息] 正在停止服务...')
            
            if backend_process:
                backend_process.terminate()
                try:
                    backend_process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    backend_process.kill()
            
            if frontend_process:
                frontend_process.terminate()
                try:
                    frontend_process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    frontend_process.kill()
            
            print('[信息] 服务已停止')
            
    except Exception as e:
        print(f'[错误] {e}')
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
