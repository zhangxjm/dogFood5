package handlers

import (
	"hardware-shop/database"
	"hardware-shop/models"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func IndexPage(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", gin.H{
		"title": "五金小店商品台账管理系统",
	})
}

func NewProductPage(c *gin.Context) {
	c.HTML(http.StatusOK, "product_form.html", gin.H{
		"title":   "新增货品",
		"product": models.Product{},
	})
}

func EditProductPage(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	db := database.GetDB()
	var product models.Product
	if err := db.First(&product, id).Error; err != nil {
		c.HTML(http.StatusNotFound, "404.html", nil)
		return
	}
	c.HTML(http.StatusOK, "product_form.html", gin.H{
		"title":   "编辑货品",
		"product": product,
	})
}

func StockPage(c *gin.Context) {
	c.HTML(http.StatusOK, "stock.html", gin.H{
		"title": "库存管理",
	})
}

func LogsPage(c *gin.Context) {
	c.HTML(http.StatusOK, "logs.html", gin.H{
		"title": "操作日志",
	})
}

func GetProducts(c *gin.Context) {
	db := database.GetDB()
	var products []models.Product

	category := c.Query("category")
	keyword := c.Query("keyword")
	alert := c.Query("alert")

	query := db.Model(&models.Product{})

	if category != "" {
		query = query.Where("category = ?", category)
	}

	if keyword != "" {
		query = query.Where("name LIKE ?", "%"+keyword+"%")
	}

	if alert == "true" {
		query = query.Where("stock <= min_stock")
	}

	if err := query.Order("id DESC").Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, products)
}

func GetProduct(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	db := database.GetDB()
	var product models.Product
	if err := db.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}
	c.JSON(http.StatusOK, product)
}

func CreateProduct(c *gin.Context) {
	db := database.GetDB()
	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if product.Stock > 0 {
		log := models.StockLog{
			ProductID:  product.ID,
			Type:       "进货",
			Quantity:   product.Stock,
			UnitPrice:  product.PurchasePrice,
			TotalPrice: product.PurchasePrice * float64(product.Stock),
			Operator:   "管理员",
			Remark:     "初始库存",
		}
		db.Create(&log)
	}

	c.JSON(http.StatusCreated, product)
}

func UpdateProduct(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	db := database.GetDB()
	var product models.Product
	if err := db.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	oldPurchasePrice := product.PurchasePrice
	oldSellPrice := product.SellPrice

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	product.ID = uint(id)

	if oldPurchasePrice != product.PurchasePrice || oldSellPrice != product.SellPrice {
		priceHistory := models.PriceHistory{
			ProductID:     product.ID,
			PurchasePrice: oldPurchasePrice,
			SellPrice:     oldSellPrice,
			ChangedAt:     time.Now(),
			Remark:        "价格更新",
		}
		db.Create(&priceHistory)
	}

	if err := db.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, product)
}

func DeleteProduct(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	db := database.GetDB()
	if err := db.Delete(&models.Product{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Product deleted"})
}

func RestockProduct(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	db := database.GetDB()
	var product models.Product
	if err := db.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	var input struct {
		Quantity int     `json:"quantity" binding:"required"`
		Price    float64 `json:"price"`
		Operator string  `json:"operator"`
		Remark   string  `json:"remark"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	product.Stock += input.Quantity

	price := input.Price
	if price == 0 {
		price = product.PurchasePrice
	}

	log := models.StockLog{
		ProductID:  product.ID,
		Type:       "进货",
		Quantity:   input.Quantity,
		UnitPrice:  price,
		TotalPrice: price * float64(input.Quantity),
		Operator:   input.Operator,
		Remark:     input.Remark,
	}

	if err := db.Create(&log).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Restock successful", "stock": product.Stock})
}

func SellProduct(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	db := database.GetDB()
	var product models.Product
	if err := db.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	var input struct {
		Quantity int     `json:"quantity" binding:"required"`
		Price    float64 `json:"price"`
		Operator string  `json:"operator"`
		Remark   string  `json:"remark"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if product.Stock < input.Quantity {
		c.JSON(http.StatusBadRequest, gin.H{"error": "库存不足"})
		return
	}

	product.Stock -= input.Quantity

	price := input.Price
	if price == 0 {
		price = product.SellPrice
	}

	log := models.StockLog{
		ProductID:  product.ID,
		Type:       "销售",
		Quantity:   input.Quantity,
		UnitPrice:  price,
		TotalPrice: price * float64(input.Quantity),
		Operator:   input.Operator,
		Remark:     input.Remark,
	}

	if err := db.Create(&log).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Sell successful", "stock": product.Stock})
}

func GetStockAlerts(c *gin.Context) {
	db := database.GetDB()
	var products []models.Product

	if err := db.Where("stock <= min_stock").Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, products)
}

func GetStockLogs(c *gin.Context) {
	db := database.GetDB()
	var logs []models.StockLog

	productID := c.Query("product_id")
	logType := c.Query("type")
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")

	query := db.Preload("Product").Model(&models.StockLog{})

	if productID != "" {
		query = query.Where("product_id = ?", productID)
	}

	if logType != "" {
		query = query.Where("type = ?", logType)
	}

	if startDate != "" {
		query = query.Where("created_at >= ?", startDate)
	}

	if endDate != "" {
		query = query.Where("created_at <= ?", endDate+" 23:59:59")
	}

	if err := query.Order("id DESC").Limit(500).Find(&logs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, logs)
}
