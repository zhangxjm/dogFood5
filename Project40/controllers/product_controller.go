package controllers

import (
	"hardware-store/database"
	"hardware-store/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CreateProductInput struct {
	Name          string  `json:"name" binding:"required"`
	Category      string  `json:"category"`
	Brand         string  `json:"brand"`
	Spec          string  `json:"spec"`
	PurchasePrice float64 `json:"purchase_price" binding:"required,min=0"`
	SalePrice     float64 `json:"sale_price" binding:"required,min=0"`
	Stock         int     `json:"stock" binding:"min=0"`
	MinStock      int     `json:"min_stock" binding:"min=0"`
	Unit          string  `json:"unit"`
	Remark        string  `json:"remark"`
}

type UpdateProductInput struct {
	Name          string  `json:"name"`
	Category      string  `json:"category"`
	Brand         string  `json:"brand"`
	Spec          string  `json:"spec"`
	PurchasePrice float64 `json:"purchase_price" binding:"min=0"`
	SalePrice     float64 `json:"sale_price" binding:"min=0"`
	Stock         int     `json:"stock" binding:"min=0"`
	MinStock      int     `json:"min_stock" binding:"min=0"`
	Unit          string  `json:"unit"`
	Remark        string  `json:"remark"`
}

func GetProducts(c *gin.Context) {
	var products []models.Product
	database.DB.Find(&products)
	c.JSON(http.StatusOK, gin.H{"data": products})
}

func GetProduct(c *gin.Context) {
	var product models.Product
	if err := database.DB.First(&product, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": product})
}

func CreateProduct(c *gin.Context) {
	var input CreateProductInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	product := models.Product{
		Name:          input.Name,
		Category:      input.Category,
		Brand:         input.Brand,
		Spec:          input.Spec,
		PurchasePrice: input.PurchasePrice,
		SalePrice:     input.SalePrice,
		Stock:         input.Stock,
		MinStock:      input.MinStock,
		Unit:          input.Unit,
		Remark:        input.Remark,
	}

	if product.MinStock == 0 {
		product.MinStock = 5
	}

	database.DB.Create(&product)
	c.JSON(http.StatusCreated, gin.H{"data": product})
}

func UpdateProduct(c *gin.Context) {
	var product models.Product
	if err := database.DB.First(&product, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	var input UpdateProductInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Model(&product).Updates(input)
	c.JSON(http.StatusOK, gin.H{"data": product})
}

func DeleteProduct(c *gin.Context) {
	var product models.Product
	if err := database.DB.First(&product, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	database.DB.Delete(&product)
	c.JSON(http.StatusOK, gin.H{"data": "Product deleted successfully"})
}

func GetLowStockProducts(c *gin.Context) {
	var products []models.Product
	database.DB.Where("stock <= min_stock").Find(&products)
	c.JSON(http.StatusOK, gin.H{
		"data":  products,
		"count": len(products),
		"msg":   "以下商品库存不足，请及时补货",
	})
}
