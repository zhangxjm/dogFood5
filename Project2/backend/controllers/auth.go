package controllers

import (
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"repair-system-backend/database"
	"repair-system-backend/models"
)

func Login(c *fiber.Ctx) error {
	var loginReq models.LoginRequest
	if err := c.BodyParser(&loginReq); err != nil {
		return c.Status(400).JSON(models.Response{
			Success: false,
			Message: "Invalid request",
		})
	}

	var user models.User
	result := database.DB.Where("username = ?", loginReq.Username).First(&user)
	if result.Error != nil {
		return c.Status(401).JSON(models.Response{
			Success: false,
			Message: "Invalid username or password",
		})
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginReq.Password))
	if err != nil {
		return c.Status(401).JSON(models.Response{
			Success: false,
			Message: "Invalid username or password",
		})
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "default_secret_key"
	}

	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["user_id"] = user.ID
	claims["username"] = user.Username
	claims["real_name"] = user.RealName
	claims["role"] = user.Role
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()

	t, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		return c.Status(500).JSON(models.Response{
			Success: false,
			Message: "Could not generate token: " + err.Error(),
		})
	}

	return c.JSON(models.Response{
		Success: true,
		Message: "Login successful",
		Data: fiber.Map{
			"token": t,
			"user":  user,
		},
	})
}

func GetCurrentUser(c *fiber.Ctx) error {
	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := uint(claims["user_id"].(float64))

	var dbUser models.User
	database.DB.First(&dbUser, userID)

	return c.JSON(models.Response{
		Success: true,
		Data:    dbUser,
	})
}
