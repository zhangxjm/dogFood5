# Poetry Appreciation Platform

A Chinese poetry appreciation and sharing platform built with Python Django.

## Features

- Poetry content management (add, edit, delete)
- Appreciation articles
- User comments and discussions
- Poetry category organization
- Search and filtering
- Responsive web interface

## Quick Start

### Windows

Double-click `start.bat` or run from command line:

```
start.bat
```

### Linux/Mac

```
chmod +x start.sh
./start.sh
```

### Docker

```
docker-compose up -d
```

## Access

- Website: http://localhost:8000
- Admin Panel: http://localhost:8000/admin
- Login: admin / admin123

## Project Structure

```
.
├── config/              # Django project configuration
├── poetry/              # Main application
│   ├── models.py        # Database models
│   ├── views.py         # View functions
│   ├── urls.py          # URL routing
│   ├── forms.py         # Form validation
│   ├── admin.py         # Admin configuration
│   └── templates/       # HTML templates
├── templates/           # Base templates
├── static/              # Static files
├── manage.py            # Django management script
├── init_data.py         # Data initialization script
├── requirements.txt     # Python dependencies
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker compose file
├── start.bat            # Windows startup script
├── start.sh             # Linux/Mac startup script
└── .gitignore           # Git ignore rules
```

## License

MIT License
