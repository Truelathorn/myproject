package controllers

import (
	"backend/config"
	"backend/models"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// =============================
// GET ALL MEMBERSHIPS
// =============================
func GetMemberships(c *gin.Context) {
	var memberships []models.Membership

	err := config.DB.
		Preload("User").
		Preload("Package").
		Preload("MembershipInfo").
		Preload("HealthAnswer").
		Order("membership_id DESC").
		Find(&memberships).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, memberships)
}

// =============================
// CREATE MEMBERSHIP (สมัคร → pending)
// =============================
func CreateMembership(c *gin.Context) {

	// 1️⃣ ดึง user_id จาก JWT
	userIDAny, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID := uint(userIDAny.(float64))

	// 2️⃣ รับข้อมูล
	var req struct {
		PackageID uint `json:"package_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 3️⃣ ตรวจสอบ package
	var pkg models.Package
	if err := config.DB.First(&pkg, req.PackageID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "package not found"})
		return
	}

	// 4️⃣ เช็คว่ามี pending อยู่ไหม
	var existing models.Membership
	err := config.DB.
		Where("user_id = ? AND status = ?", userID, "pending").
		First(&existing).Error

	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "you already have a pending membership",
		})
		return
	}

	// 5️⃣ สร้าง membership แบบ pending
	membership := models.Membership{
		UserID:    userID,
		PackageID: pkg.PackageID,
		Status:    "pending",
	}

	if err := config.DB.Create(&membership).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status":  "success",
		"message": "สมัครเรียบร้อย รอ admin อนุมัติ",
		"data": gin.H{
			"membership_id": membership.MembershipID,
			"status":        membership.Status,
		},
	})
}

// =============================
// ADMIN APPROVE MEMBERSHIP
// =============================
func ApproveMembership(c *gin.Context) {

	id := c.Param("id")

	var membership models.Membership
	if err := config.DB.
		Preload("Package").
		First(&membership, id).Error; err != nil {

		c.JSON(http.StatusNotFound, gin.H{"error": "membership not found"})
		return
	}

	if membership.Status != "pending" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "membership already processed"})
		return
	}

	// 👉 สร้าง membership_no จาก ID
	number := "M" + time.Now().Format("2006") + "-" +
		fmt.Sprintf("%04d", membership.MembershipID)

	// 👉 คำนวณวันหมดอายุ
	start := time.Now()
	end := start.AddDate(0, membership.Package.Duration, 0)

	membership.MembershipNo = number

	membership.StartDate = start
	membership.EndDate = end

	membership.Status = "active"

	if err := config.DB.Save(&membership).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":       "membership approved",
		"membership_no": number,
	})
}

// =============================
// CANCEL MEMBERSHIP
// =============================
func DeleteMembership(c *gin.Context) {

	id := c.Param("id")

	result := config.DB.
		Model(&models.Membership{}).
		Where("membership_id = ?", id).
		Update("status", "rejected")

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "membership not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

// =============================
// GET ALL USER MEMBERSHIPS (เฉพาะ role=user)
// =============================
func GetAllMemberMemberships(c *gin.Context) {

	var memberships []models.Membership

	err := config.DB.
		Joins("JOIN users ON users.user_id = memberships.user_id").
		Where("users.role = ?", "user").
		Preload("User").
		Preload("Package").
		Preload("MembershipInfo").
		Order("memberships.membership_id DESC").
		Find(&memberships).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, memberships)

}
func RejectMembership(c *gin.Context) {
	id := c.Param("id")

	result := config.DB.
		Model(&models.Membership{}).
		Where("membership_id = ?", id).
		Update("status", "rejected")

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "membership not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "membership rejected",
	})
}
// =============================
// MEMBERSHIP INFO (สำหรับเก็บข้อมูลส่วนตัวจากฟอร์มตอนสมัคร)
// =============================
func CreateMembershipInfo(c *gin.Context) {

	var req models.MembershipInfo

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ป้องกันสร้างซ้ำ
	var existing models.MembershipInfo
	if err := config.DB.
		Where("membership_id = ?", req.MembershipID).
		First(&existing).Error; err == nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "membership info already exists",
		})
		return
	}

	if err := config.DB.Create(&req).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, req)
}
func UpdateMembershipInfo(c *gin.Context) {

	id := c.Param("id")

	var info models.MembershipInfo
	if err := config.DB.
		Where("membership_id = ?", id).
		First(&info).Error; err != nil {

		c.JSON(http.StatusNotFound, gin.H{"error": "membership info not found"})
		return
	}

	var input models.MembershipInfo
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	input.InfoID = info.InfoID
	input.MembershipID = info.MembershipID

	config.DB.Save(&input)

	c.JSON(http.StatusOK, input)
}
func DeleteMembershipInfo(c *gin.Context) {

	id := c.Param("id")

	result := config.DB.
		Where("membership_id = ?", id).
		Delete(&models.MembershipInfo{})

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "deleted"})
}

func CreateHealthAnswer(c *gin.Context) {
	var req models.HealthAnswer

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Create(&req)

	c.JSON(http.StatusCreated, req)
}
