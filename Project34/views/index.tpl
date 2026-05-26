<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Warehouse Management System</title>
    <link rel="stylesheet" href="/static/css/style.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-brand">WMS - Warehouse Management</div>
        <ul class="nav-menu">
            <li><a href="/" class="{{if .IsHome}}active{{end}}">Dashboard</a></li>
            <li><a href="/warehouse-areas" class="{{if .IsWarehouse}}active{{end}}">Warehouse Areas</a></li>
            <li><a href="/materials" class="{{if .IsMaterial}}active{{end}}">Materials</a></li>
            <li><a href="/records" class="{{if .IsRecord}}active{{end}}">Records</a></li>
        </ul>
    </nav>
    <div class="container">
        <h1>Welcome to Warehouse Management System</h1>
        <div class="dashboard-cards">
            <div class="card">
                <h3>Warehouse Areas</h3>
                <p>Manage warehouse storage areas and zones</p>
                <a href="/warehouse-areas" class="btn">Manage Areas</a>
            </div>
            <div class="card">
                <h3>Materials</h3>
                <p>Register and manage inventory materials</p>
                <a href="/materials" class="btn">Manage Materials</a>
            </div>
            <div class="card">
                <h3>Records</h3>
                <p>Track stock-in and stock-out transactions</p>
                <a href="/records" class="btn">View Records</a>
            </div>
        </div>
        <div class="info-section">
            <h2>System Overview</h2>
            <p>This system provides comprehensive warehouse management capabilities including:</p>
            <ul>
                <li><strong>Warehouse Area Management</strong> - Define and organize storage locations</li>
                <li><strong>Material Registration</strong> - Add new materials with detailed information</li>
                <li><strong>Stock Tracking</strong> - Real-time inventory tracking and management</li>
                <li><strong>Transaction Records</strong> - Complete audit trail of all stock movements</li>
            </ul>
        </div>
    </div>
    <footer class="footer">
        <p>Warehouse Management System &copy; 2026</p>
    </footer>
    <script src="/static/js/app.js"></script>
</body>
</html>
