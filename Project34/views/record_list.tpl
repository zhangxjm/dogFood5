<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Records - WMS</title>
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
        <h1>Material Transaction Records</h1>
        
        <div class="form-section">
            <div class="forms-grid">
                <div class="form-card">
                    <h2>Stock In</h2>
                    <form id="stockInForm" class="form-vertical">
                        <div class="form-group">
                            <label>Material</label>
                            <select id="inMaterialId" name="material_id" required>
                                <option value="">Select Material</option>
                                {{range .Materials}}
                                <option value="{{.Id}}">{{.Code}} - {{.Name}} (Stock: {{.Stock}})</option>
                                {{end}}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Quantity</label>
                            <input type="number" id="inQuantity" name="quantity" min="1" required>
                        </div>
                        <div class="form-group">
                            <label>Operator</label>
                            <input type="text" id="inOperator" name="operator" required>
                        </div>
                        <div class="form-group">
                            <label>Remark</label>
                            <input type="text" id="inRemark" name="remark">
                        </div>
                        <button type="submit" class="btn btn-success">Stock In</button>
                    </form>
                </div>

                <div class="form-card">
                    <h2>Stock Out</h2>
                    <form id="stockOutForm" class="form-vertical">
                        <div class="form-group">
                            <label>Material</label>
                            <select id="outMaterialId" name="material_id" required>
                                <option value="">Select Material</option>
                                {{range .Materials}}
                                <option value="{{.Id}}">{{.Code}} - {{.Name}} (Stock: {{.Stock}})</option>
                                {{end}}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Quantity</label>
                            <input type="number" id="outQuantity" name="quantity" min="1" required>
                        </div>
                        <div class="form-group">
                            <label>Operator</label>
                            <input type="text" id="outOperator" name="operator" required>
                        </div>
                        <div class="form-group">
                            <label>Remark</label>
                            <input type="text" id="outRemark" name="remark">
                        </div>
                        <button type="submit" class="btn btn-warning">Stock Out</button>
                    </form>
                </div>
            </div>
        </div>

        <div class="table-section">
            <h2>Recent Records (Last 100)</h2>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Material Code</th>
                        <th>Material Name</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Operator</th>
                        <th>Remark</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {{range .Records}}
                    <tr>
                        <td>{{.Id}}</td>
                        <td>{{.MaterialCode}}</td>
                        <td>{{.MaterialName}}</td>
                        <td>
                            <span class="badge {{if eq .Type "in"}}badge-in{{else}}badge-out{{end}}">
                                {{if eq .Type "in"}}Stock In{{else}}Stock Out{{end}}
                            </span>
                        </td>
                        <td>{{.Quantity}}</td>
                        <td>{{.Operator}}</td>
                        <td>{{.Remark}}</td>
                        <td>{{.CreatedAt.Format "2006-01-02 15:04:05"}}</td>
                    </tr>
                    {{else}}
                    <tr>
                        <td colspan="8" class="empty">No records found</td>
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
