import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Modal } from "react-bootstrap";

const AdminUserEditMock = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🔹 mock data
  const [form, setForm] = useState({
    username: "mock_user",
    email: "mock@email.com",
    role: "user",
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 เปิด confirm modal
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  // 🔹 mock submit จริง
  const submitEdit = () => {
    setLoading(true);

    setTimeout(() => {
      console.log("Mock submit data:", {
        id,
        ...form,
      });

      alert("Mock: บันทึกการแก้ไขเรียบร้อยแล้ว");
      setLoading(false);
      setShowConfirm(false);
      navigate("/admin/users");
    }, 800);
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card
            style={{
              border: "2px solid #FF7F11",
            }}
          >
            <Card.Body>
              <Card.Title>แก้ไขผู้ใช้</Card.Title>
              <Card.Subtitle className="mb-3 text-muted">
                User ID: {id}
              </Card.Subtitle>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/admin/users")}
                  >
                    ยกเลิก
                  </Button>
                  <Button type="submit">
                    บันทึก
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Confirm Modal */}
      <Modal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        centered
      >
        <div
          style={{
            border: "2px solid #FF7F11",
            borderRadius: "8px",
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>ยืนยันการแก้ไข</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            คุณต้องการบันทึกการแก้ไขข้อมูลผู้ใช้นี้ใช่หรือไม่?
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowConfirm(false)}
            >
              ยกเลิก
            </Button>
            <Button
              style={{
                backgroundColor: "#FF7F11",
                borderColor: "#FF7F11",
              }}
              onClick={submitEdit}
              disabled={loading}
            >
              {loading ? "กำลังบันทึก..." : "ยืนยัน"}
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </Container>
  );
};

export default AdminUserEditMock;