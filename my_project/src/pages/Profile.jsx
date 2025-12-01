import React from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Profile({ user }) {
     const navigate = useNavigate();
    const mockUser = user || {
        accountName: "tulathorn99",
        email: "tulathorn@example.com",
        firstName: "Tulathorn",
        lastName: "P.",
        phone: "0912345678",
        membership: null,
        // membership: { level: "Gold", expired: "2025-12-31" },
    };

    return (
        <Container className="py-5">
            <h2 className="mb-2" style={{ color: '#FF7F11' }}>My Profile</h2>
            <p className="text-muted mb-4">Manage your account information and membership</p>

            <Row className="g-4">
                {/* LEFT — PROFILE INFO */}
                <Col lg={6}>
                    <Card
                        className="shadow-lg h-100"
                        style={{
                            borderRadius: '20px',
                            backgroundColor: '#ffffff',
                            padding: '1rem',
                            border: '2px solid #FF7F11',
                            color: '#1F1F1F'
                        }}
                    >
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="mb-0" style={{ color: '#FF7F11' }}>User Profile</h5>
                                <Button
                                    variant="light"
                                    size="sm"
                                    className="d-flex align-items-center gap-2 rounded-pill"
                                    style={{ backgroundColor: '#FF7F11', color: '#ffffff', fontWeight: 'bold' }}
                                >
                                    <i className="bi bi-pencil" />
                                    Edit
                                </Button>
                            </div>

                            <div className="text-center mb-4">
                                <div
                                    className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
                                    style={{ width: '100px', height: '100px', backgroundColor: '#FF7F11' }}
                                >
                                    <i className="bi bi-person" style={{ fontSize: '48px', color: '#ffffff' }}></i>
                                </div>
                                <h4 className="mb-1">{mockUser.firstName} {mockUser.lastName}</h4>
                                <p className="text-muted mb-0">@{mockUser.accountName}</p>
                            </div>

                            <div className="d-flex flex-column gap-3">
                                {[
                                    { icon: 'bi-envelope', label: 'Email', value: mockUser.email, bg: '#FF7F11', color: '#ffffff' },
                                    { icon: 'bi-person-badge', label: 'Full Name', value: `${mockUser.firstName} ${mockUser.lastName}`, bg: '#FFA94D', color: '#ffffff' },
                                    { icon: 'bi-telephone', label: 'Phone', value: mockUser.phone, bg: '#FF7F11', color: '#ffffff' },
                                ].map((item, idx) => (
                                    <div key={idx} className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ backgroundColor: '#FFF5EE' }}>
                                        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: item.bg }}>
                                            <i className={`bi ${item.icon}`} style={{ fontSize: '20px', color: item.color }}></i>
                                        </div>
                                        <div className="flex-grow-1">
                                            <small className="text-muted d-block">{item.label}</small>
                                            <span>{item.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* RIGHT — MEMBERSHIP STATUS */}
                <Col lg={6}>
                    <Card
                        className="shadow-lg h-100"
                        style={{
                            borderRadius: '20px',
                            backgroundColor: '#ffffff',
                            padding: '1rem',
                            border: '2px solid #FF7F11',
                            color: '#1F1F1F'
                        }}
                    >
                        <Card.Body>
                            <div className="d-flex align-items-center gap-2 mb-4">
                                <i className="bi bi-award" style={{ fontSize: '24px', color: '#FF7F11' }}></i>
                                <h5 className="mb-0" style={{ color: '#FF7F11' }}>Membership Status</h5>
                            </div>

                            {!mockUser.membership && (
                                <>
                                    <Alert variant="danger" className="rounded-3">
                                        You currently have no active membership.
                                    </Alert>
                                    <div className="text-center mb-3">
                                        <Button
                                            className="px-5 py-2 border-0 rounded-pill w-100"
                                            style={{ backgroundColor: '#FF7F11', color: '#ffffff', fontWeight: 'bold' }}
                                            onClick={() => navigate("/package")} // <-- navigate ไป /package
                                        >
                                            สมัครสมาชิก
                                        </Button>
                                    </div>
                                    <Alert variant="warning" className="text-center rounded-3">
                                        ⚠️ ต้องสมัครสมาชิกก่อนจึงจะสามารถเข้าถึง QR Code
                                    </Alert>
                                </>
                            )}

                            {mockUser.membership && (
                                <>
                                    <Alert variant="success" className="rounded-3" style={{ backgroundColor: '#FF7F11', color: '#ffffff', border: 'none' }}>
                                        You are a <strong>{mockUser.membership.level}</strong> member
                                    </Alert>
                                    <p className="text-muted mb-3">Expires: {mockUser.membership.expired}</p>
                                    <div
                                        style={{
                                            width: "150px",
                                            height: "150px",
                                            border: "2px dashed #FF7F11",
                                            borderRadius: "12px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            margin: "0 auto",
                                            fontSize: "0.9rem",
                                            color: "#FFA94D",
                                        }}
                                    >
                                        QR Code Preview
                                    </div>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
