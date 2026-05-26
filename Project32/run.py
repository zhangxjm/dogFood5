from app import create_app
from init_data import init_data
import os

app = create_app()

if __name__ == '__main__':
    init_data()
    app.run(host='0.0.0.0', port=5000, debug=True)
