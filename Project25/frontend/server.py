import http.server
import socketserver
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 18956
BACKEND_PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 15234
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()
    
    def do_GET(self):
        if self.path == '/config.js':
            content = f'window.API_BASE = "http://localhost:{BACKEND_PORT}";'
            self.send_response(200)
            self.send_header('Content-Type', 'application/javascript')
            self.send_header('Content-Length', len(content))
            self.end_headers()
            self.wfile.write(content.encode())
            return
        super().do_GET()

os.chdir(DIRECTORY)

with socketserver.TCPServer(('', PORT), MyHTTPRequestHandler) as httpd:
    print(f'前端服务运行在: http://localhost:{PORT}')
    print(f'后端服务地址: http://localhost:{BACKEND_PORT}')
    httpd.serve_forever()
