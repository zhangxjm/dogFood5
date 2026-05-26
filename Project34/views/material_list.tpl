<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Materials - WMS</title>
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
        <h1>Materials Management</h1>
        
        <div class="form-section">
            <h2>Add New Material</h2>
            <form id="addMaterialForm" class="form-inline">
                <div class="form-group">
                    <label>Code</label>
                    <input type="text" id="materialCode" name="code" required>
                </div>
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" id="materialName" name="name" required>
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <input type="text" id="materialCategory" name="category">
                </div>
                <div class="form-group">
                    <label>Unit</label>
                    <input type="text" id="materialUnit" name="unit">
                </div>
                <div class="form-group">
                    <label>Warehouse Area</label>
                    <select id="materialAreaId" name="warehouse_area_id">
                        <option value="">Select Area</option>
                        {{range .Areas}}
                        <option value="{{.Id}}">{{.Name}} ({{.Code}})</option>
                        {{end}}
                    </select>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <input type="text" id="materialDescription" name="description">
                </div>
                <button type="submit" class="btn btn-primary">Add Material</button>
            </form>
        </div>

        <div class="table-section">
            <h2>Material List</h2>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Unit</th>
                        <th>Warehouse Area</th>
                        <th>Stock</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {{range .Materials}}
                    <tr>
                        <td>{{.Id}}</td>
                        <td>{{.Code}}</td>
                        <td>{{.Name}}</td>
                        <td>{{.Category}}</td>
                        <td>{{.Unit}}</td>
                        <td>{{.AreaName}}</td>
                        <td class="stock-{{if lt .Stock 50}}low{{else}}ok{{end}}">{{.Stock}}</td>
                        <td>{{.Description}}</td>
                        <td>
                            <button onclick="deleteMaterial({{.Id}})" class="btn btn-danger btn-sm">Delete</button>
                        </td>
                    </tr>
                    {{else}}
                    <tr>
                        <td colspan="9" class="empty">No materials found</td>
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
