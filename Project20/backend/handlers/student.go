package handlers

import (
	"driving-school-backend/config"
	"driving-school-backend/models"

	"github.com/gofiber/fiber/v2"
)

func GetStudents(c *fiber.Ctx) error {
	var students []models.Student
	if err := config.DB.Find(&students).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Failed to fetch students: " + err.Error(),
		})
	}
	return c.JSON(fiber.Map{
		"success": true,
		"data":    students,
	})
}

func GetStudent(c *fiber.Ctx) error {
	id := c.Params("id")
	var student models.Student
	if err := config.DB.First(&student, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"success": false,
			"message": "Student not found",
		})
	}
	return c.JSON(fiber.Map{
		"success": true,
		"data":    student,
	})
}

func CreateStudent(c *fiber.Ctx) error {
	type CreateStudentRequest struct {
		Name        string `json:"name"`
		Phone       string `json:"phone"`
		IDCard      string `json:"id_card"`
		SubjectType string `json:"subject_type"`
	}

	var req CreateStudentRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
		})
	}

	var existingStudent models.Student
	if config.DB.Where("phone = ? OR id_card = ?", req.Phone, req.IDCard).First(&existingStudent).Error == nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Student with this phone or ID card already exists",
		})
	}

	student := models.Student{
		Name:        req.Name,
		Phone:       req.Phone,
		IDCard:      req.IDCard,
		SubjectType: req.SubjectType,
	}

	if err := config.DB.Create(&student).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Failed to create student",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    student,
		"message": "Student created successfully",
	})
}
