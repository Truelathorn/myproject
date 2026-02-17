package models

import "time"

type MembershipInfo struct {
	InfoID       uint `gorm:"primaryKey;column:info_id"`
	MembershipID uint `gorm:"column:membership_id;unique;not null"`

	FullName string `gorm:"size:100;not null"`
	Gender   string `gorm:"size:10"`

	BirthDate *time.Time `gorm:"column:birth_date"`

	Phone  string `gorm:"size:20"`
	Email  string `gorm:"size:100"`
	LineID string `gorm:"size:100"`

	UserType  string `gorm:"size:30"`
	Faculty   string `gorm:"size:100"`
	Major     string `gorm:"size:100"`
	StudentID string `gorm:"size:50"`

	Department string `gorm:"size:100"`

	EmergencyName  string `gorm:"size:100"`
	EmergencyPhone string `gorm:"size:20"`

	KnownFrom string `gorm:"size:100"`

	CreatedAt time.Time `gorm:"column:created_at"`


}

func (MembershipInfo) TableName() string {
	return "membership_info"
}
