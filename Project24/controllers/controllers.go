package controllers

import (
	"net/http"
	"strconv"
	"time"

	"fishing-store/database"
	"fishing-store/models"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

func GetCategories(c *gin.Context) {
	var categories []models.Category
	database.DB.Find(&categories)
	c.JSON(http.StatusOK, Response{
		Code:    200,
		Message: "success",
		Data:    categories,
	})
}

func GetCategory(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var category models.Category
	if err := database.DB.First(&category, id).Error; err != nil {
		c.JSON(http.StatusNotFound, Response{
			Code:    404,
			Message: "Category not found",
		})
		return
	}
	c.JSON(http.StatusOK, Response{
		Code:    200,
		Message: "success",
		Data:    category,
	})
}

func CreateCategory(c *gin.Context) {
	var category models.Category
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Code:    400,
			Message: err.Error(),
		})
		return
	}
	database.DB.Create(&category)
	c.JSON(http.StatusCreated, Response{
		Code:    201,
		Message: "Category created successfully",
		Data:    category,
	})
}

func UpdateCategory(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var category models.Category
	if err := database.DB.First(&category, id).Error; err != nil {
		c.JSON(http.StatusNotFound, Response{
			Code:    404,
			Message: "Category not found",
		})
		return
	}
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Code:    400,
			Message: err.Error(),
		})
		return
	}
	database.DB.Save(&category)
	c.JSON(http.StatusOK, Response{
		Code:    200,
		Message: "Category updated successfully",
		Data:    category,
	})
}

func DeleteCategory(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := database.DB.Delete(&models.Category{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, Response{
			Code:    500,
			Message: err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, Response{
		Code:    200,
		Message: "Category deleted successfully",
	})
}

func GetProducts(c *gin.Context) {
	var products []models.Product
	database.DB.Preload("Category").Find(&products)
	c.JSON(http.StatusOK, Response{
		Code:    200,
		Message: "success",
		Data:    products,
	})
}

func GetProduct(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var product models.Product
	if err := database.DB.Preload("Category").First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, Response{
			Code:    404,
			Message: "Product not found",
		})
		return
	}
	c.JSON(http.StatusOK, Response{
		Code:    200,
		Message: "success",
		Data:    product,
	})
}

func CreateProduct(c *gin.Context) {
	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Code:    400,
			Message: err.Error(),
		})
		return
	}
	database.DB.Create(&product)
	c.JSON(http.StatusCreated, Response{
		Code:    201,
		Message: "Product created successfully",
		Data:    product,
	})
}

func UpdateProduct(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var product models.Product
	if err := database.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, Response{
			Code:    404,
			Message: "Product not found",
		})
		return
	}
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Code:    400,
			Message: err.Error(),
		})
		return
	}
	database.DB.Save(&product)
	c.JSON(http.StatusOK, Response{
		Code:    200,
		Message: "Product updated successfully",
		Data:    product,
	})
}

func DeleteProduct(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := database.DB.Delete(&models.Product{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, Response{
			Code:    500,
			Message: err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, Response{
		Code:    200,
		Message: "Product deleted successfully",
	})
}

func GetCustomers(c *gin.Context) {
	var customers []models.Customer
	database.DB.Find(&customers)
	c.JSON(http.StatusOK, Response{
		Code:    200,
		Message: "success",
		Data:    customers,
	})
}

func GetCustomer(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var customer models.Customer
	if err := database.DB.First(&customer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, Response{
			Code:    404,
			Message: "Customer not found",
		})
		return
	}
	c.JSON(http.StatusOK, Response{
		Code:    200,
		Message: "success",
		Data:    customer,
	})
}

func CreateCustomer(c *gin.Context) {
	var customer models.Customer
	if err := c.ShouldBindJSON(&customer); err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Code:    400,
			Message: err.Error(),
		})
		return
	}
	database.DB.Create(&customer)
	c.JSON(http.StatusCreated, Response{
		Code:    201,
		Message: "Customer created successfully",
		Data:    customer,
	})
}

func UpdateCustomer(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var customer models.Customer
	if err := database.DB.First(&customer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, Response{
			Code:    404,
			Message: "Customer not found",
		})
		return
	}
	if err := c.ShouldBindJSON(&customer); err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Code:    400,
			Message: err.Error(),
		})
		return
	}
	database.DB.Save(&customer)
	c.JSON(http.StatusOK, Response{
		Code:    200,
		Message: "Customer updated successfully",
		Data:    customer,
	})
}

func DeleteCustomer(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := database.DB.Delete(&models.Customer{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, Response{
			Code:    500,
			Message: err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, Response{
		Code:    200,
		Message: "Customer deleted successfully",
	})
}

func GetPurchaseRecords(c *gin.Context) {
	var records []models.PurchaseRecord
	database.DB.Preload("Customer").Preload("Product").Preload("Product.Category").Find(&records)
	c.JSON(http.StatusOK, Response{
		Code:    200,
		Message: "success",
		Data:    records,
	})
}

func GetPurchaseRecord(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var record models.PurchaseRecord
	if err := database.DB.Preload("Customer").Preload("Product").Preload("Product.Category").First(&record, id).Error; err != nil {
		c.JSON(http.StatusNotFound, Response{
			Code:    404,
			Message: "Purchase record not found",
		})
		return
	}
	c.JSON(http.StatusOK, Response{
		Code:    200,
		Message: "success",
		Data:    record,
	})
}

func CreatePurchaseRecord(c *gin.Context) {
	var record models.PurchaseRecord
	if err := c.ShouldBindJSON(&record); err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Code:    400,
			Message: err.Error(),
		})
		return
	}

	var product models.Product
	if err := database.DB.First(&product, record.ProductID).Error; err != nil {
		c.JSON(http.StatusNotFound, Response{
			Code:    404,
			Message: "Product not found",
		})
		return
	}

	if product.StockQuantity < record.Quantity {
		c.JSON(http.StatusBadRequest, Response{
			Code:    400,
			Message: "Insufficient stock",
		})
		return
	}

	record.UnitPrice = product.Price
	record.TotalPrice = product.Price * float64(record.Quantity)
	if record.PurchaseDate.IsZero() {
		record.PurchaseDate = time.Now()
	}

	tx := database.DB.Begin()
	if err := tx.Create(&record).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, Response{
			Code:    500,
			Message: err.Error(),
		})
		return
	}

	product.StockQuantity -= record.Quantity
	if err := tx.Save(&product).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, Response{
			Code:    500,
			Message: err.Error(),
		})
		return
	}

	tx.Commit()

	database.DB.Preload("Customer").Preload("Product").Preload("Product.Category").First(&record, record.ID)
	c.JSON(http.StatusCreated, Response{
		Code:    201,
		Message: "Purchase record created successfully",
		Data:    record,
	})
}

func DeletePurchaseRecord(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := database.DB.Delete(&models.PurchaseRecord{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, Response{
			Code:    500,
			Message: err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, Response{
		Code:    200,
		Message: "Purchase record deleted successfully",
	})
}

func GetRestockAlerts(c *gin.Context) {
	var products []models.Product
	database.DB.Preload("Category").Where("stock_quantity <= warning_quantity").Find(&products)

	var alerts []models.RestockAlert
	for _, product := range products {
		alert := models.RestockAlert{
			ID:              product.ID,
			ProductID:       product.ID,
			ProductName:     product.Name,
			CategoryName:    product.Category.Name,
			CurrentStock:    product.StockQuantity,
			WarningQuantity: product.WarningQuantity,
			NeedRestock:     product.WarningQuantity*2 - product.StockQuantity,
			Supplier:        product.Supplier,
		}
		alerts = append(alerts, alert)
	}

	c.JSON(http.StatusOK, Response{
		Code:    200,
		Message: "success",
		Data:    alerts,
	})
}

func RestockProduct(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var req struct {
		Quantity int `json:"quantity"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Code:    400,
			Message: err.Error(),
		})
		return
	}

	var product models.Product
	if err := database.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, Response{
			Code:    404,
			Message: "Product not found",
		})
		return
	}

	product.StockQuantity += req.Quantity
	database.DB.Save(&product)

	c.JSON(http.StatusOK, Response{
		Code:    200,
		Message: "Restock successful",
		Data:    product,
	})
}

func GetDashboardStats(c *gin.Context) {
	var categoryCount int
	var productCount int
	var customerCount int
	var totalSales float64

	database.DB.Model(&models.Category{}).Count(&categoryCount)
	database.DB.Model(&models.Product{}).Count(&productCount)
	database.DB.Model(&models.Customer{}).Count(&customerCount)
	database.DB.Model(&models.PurchaseRecord{}).Select("IFNULL(SUM(total_price), 0)").Scan(&totalSales)

	var lowStockCount int
	database.DB.Model(&models.Product{}).Where("stock_quantity <= warning_quantity").Count(&lowStockCount)

	stats := map[string]interface{}{
		"category_count":  categoryCount,
		"product_count":   productCount,
		"customer_count":  customerCount,
		"total_sales":     totalSales,
		"low_stock_count": lowStockCount,
	}

	c.JSON(http.StatusOK, Response{
		Code:    200,
		Message: "success",
		Data:    stats,
	})
}
