document.addEventListener('DOMContentLoaded', function() {
    var addAreaForm = document.getElementById('addAreaForm');
    if (addAreaForm) {
        addAreaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var formData = new FormData(addAreaForm);
            fetch('/warehouse-areas/add', {
                method: 'POST',
                body: formData
            })
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data.success) {
                    alert('Area added successfully!');
                    location.reload();
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(function(err) {
                alert('Request failed: ' + err);
            });
        });
    }

    var addMaterialForm = document.getElementById('addMaterialForm');
    if (addMaterialForm) {
        addMaterialForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var formData = new FormData(addMaterialForm);
            fetch('/materials/add', {
                method: 'POST',
                body: formData
            })
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data.success) {
                    alert('Material added successfully!');
                    location.reload();
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(function(err) {
                alert('Request failed: ' + err);
            });
        });
    }

    var stockInForm = document.getElementById('stockInForm');
    if (stockInForm) {
        stockInForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var formData = new FormData(stockInForm);
            fetch('/records/in', {
                method: 'POST',
                body: formData
            })
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data.success) {
                    alert('Stock-in record created successfully! New stock: ' + data.new_stock);
                    location.reload();
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(function(err) {
                alert('Request failed: ' + err);
            });
        });
    }

    var stockOutForm = document.getElementById('stockOutForm');
    if (stockOutForm) {
        stockOutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var formData = new FormData(stockOutForm);
            fetch('/records/out', {
                method: 'POST',
                body: formData
            })
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data.success) {
                    alert('Stock-out record created successfully! New stock: ' + data.new_stock);
                    location.reload();
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(function(err) {
                alert('Request failed: ' + err);
            });
        });
    }
});

function deleteArea(id) {
    if (confirm('Are you sure you want to delete this area?')) {
        fetch('/warehouse-areas/delete/' + id, {
            method: 'GET'
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data.success) {
                alert('Area deleted successfully!');
                location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(function(err) {
            alert('Request failed: ' + err);
        });
    }
}

function deleteMaterial(id) {
    if (confirm('Are you sure you want to delete this material?')) {
        fetch('/materials/delete/' + id, {
            method: 'GET'
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data.success) {
                alert('Material deleted successfully!');
                location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(function(err) {
            alert('Request failed: ' + err);
        });
    }
}
