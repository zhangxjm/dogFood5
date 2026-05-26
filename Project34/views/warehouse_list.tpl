<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Warehouse Areas - WMS</title>
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
        <h1>Warehouse Areas Management</h1>
        
        <div class="form-section">
            <h2>Add New Area</h2>
            <form id="addAreaForm" class="form-inline">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" id="areaName" name="name" required>
                </div>
                <div class="form-group">
                    <label>Code</label>
                    <input type="text" id="areaCode" name="code" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <input type="text" id="areaDescription" name="description">
                </div>
                <button type="submit" class="btn btn-primary">Add Area</button>
            </form>
        </div>

        <div class="table-section">
            <h2>Area List</h2>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Code</th>
                        <th>Description</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {{range .Areas}}
                    <tr>
                        <td>{{.Id}}</td>
                        <td>{{.Name}}</td>
                        <td>{{.Code}}</td>
                        <td>{{.Description}}</td>
                        <td>{{.CreatedAt.Format "2006-01-02 15:04:05"}}</td>
                        <td>
                            <button onclick="deleteArea({{.Id}})" class="btn btn-danger btn-sm">Delete</button>
                        </td>
                    </tr>
                    {{else}}
                    <tr>
                        <td colspan="6" class="empty">No warehouse areas found</td>
                    </tr>
                    {{end}}
                </tbody>
            </table>
        </div>
    </div>
    <footer class="footer">
        <p>Warehouse Management System &copy; 2026</p>
    </footer>
    <script src="/static/js/app.js"></script>
</body>
</html>
