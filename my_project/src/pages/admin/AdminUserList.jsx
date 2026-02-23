import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Container,
  Row,
  Col,
  Form,
  Badge,
  Modal
} from "react-bootstrap";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("user"); // ✅ default user
  const [expandedUser, setExpandedUser] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => setUsers(res.data || []))
      .catch((err) => console.error("Error fetching users:", err));
  }, [token]);

  // ================= FILTER =================

  const filteredUsers = users.filter((u) => {
    const membership = u.memberships?.[0];

    return (
      (
        u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        membership?.membership_no?.toLowerCase().includes(search.toLowerCase())
      ) &&
      (roleFilter ? u.role === roleFilter : true)
    );
  });

  const roleBadge = (role) => {
    switch (role) {
      case "admin":
        return <Badge bg="danger">Admin</Badge>;
      case "fitness_staff":
        return <Badge bg="warning">Staff</Badge>;
      default:
        return <Badge bg="secondary">User</Badge>;
    }
  };

  const userTypeBadge = (user) => {
    const membership = user.memberships?.[0];
    if (!membership)
      return <Badge bg="light" text="dark">No Package</Badge>;

    switch (membership.package?.user_type) {
      case "student":
        return <Badge bg="info">Student</Badge>;
      case "university_staff":
        return <Badge bg="success">University Staff</Badge>;
      default:
        return <Badge bg="secondary">External</Badge>;
    }
  };
  const PACKAGE_MAP = {
    1: { userType: "นักเรียน/นักศึกษา", duration: "รายเดือน" },
    3: { userType: "บุคลากรในมหาวิทยาลัย", duration: "รายเดือน" },
    5: { userType: "บุคคลภายนอก", duration: "รายเดือน" },

    2: { userType: "นักเรียน/นักศึกษา", duration: "4 เดือน" },
    4: { userType: "บุคลากรในมหาวิทยาลัย", duration: "4 เดือน" },
    6: { userType: "บุคคลภายนอก", duration: "4 เดือน" },
  };
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    return date.toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  // ================= DELETE =================

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setPassword("");
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
    setPassword("");
  };

  const handleDeleteUser = async () => {
    if (!password) {
      alert("กรุณากรอกรหัสผ่าน");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:8080/api/v1/admin/users/${selectedUser.user_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password }),
        }
      );

      if (!res.ok) throw new Error();

      alert("ลบผู้ใช้เรียบร้อยแล้ว");
      closeDeleteModal();
      // รีเฟรชหน้าหลังลบ
      const updatedUsers = users.filter((u) => u.user_id !== selectedUser.user_id);
      setUsers(updatedUsers);

    } catch {
      alert("รหัสผ่านไม่ถูกต้อง หรือไม่สามารถลบได้");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================

  return (
    <Container className="py-4">
      <Row className="mb-3 align-items-center">
        <Col>
          <h2 className="fw-bold">Manage Users</h2>
        </Col>

        <Col className="d-flex justify-content-end gap-2">
          <Button
            variant="outline-primary"
            onClick={() => navigate("/admin/memberships")}
          >
            Manage Memberships
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate("/admin/users/create")}
          >
            <i className="bi bi-plus-circle me-1"></i>
            Create User
          </Button>
        </Col>
      </Row>

      {/* FILTERS */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search by name, username, email, membership no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>

        <Col md={4}>
          <Form.Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="fitness_staff">Staff</option>
          </Form.Select>
        </Col>
      </Row>

      {/* TABLE */}
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Membership No</th> {/* ✅ เพิ่ม */}
            <th>Full Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>User Type</th>
            <th width="220px">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center text-muted">
                No users found
              </td>
            </tr>
          ) : (
            filteredUsers.map((u, index) => {
              const membership = u.memberships?.[0];

              return (
                <React.Fragment key={u.user_id}>
                  <tr>
                    <td>{index + 1}</td>
                    <td>{membership?.membership_no || "-"}</td>
                    <td>{u.full_name}</td>
                    <td>@{u.username}</td>
                    <td>{u.email}</td>
                    <td>{roleBadge(u.role)}</td>
                    <td>{userTypeBadge(u)}</td>

                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        onClick={() =>
                          setExpandedUser(
                            expandedUser === u.user_id ? null : u.user_id
                          )
                        }
                      >
                        {expandedUser === u.user_id ? "Hide" : "View"}
                      </Button>

                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => navigate(`/admin/users/edit/${u.user_id}`)}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => openDeleteModal(u)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>

                  {/* DROPDOWN DETAIL */}
                  {/* DROPDOWN DETAIL */}
                  {expandedUser === u.user_id && (
                    <tr>
                      <td colSpan="8" className="bg-light">
                        {membership ? (
                          <div
                            className="p-3 bg-white rounded shadow-sm"
                            style={{ borderLeft: "4px solid #FF7F11" }}
                          >
                            <Row className="mb-3">
                              {/* MEMBERSHIP */}
                              <Col md={6}>
                                <h6 className="text-primary mb-2">📦 Membership</h6>
                                <p className="mb-1">
                                  <strong>Status:</strong>{" "}
                                  <Badge bg={membership.status === "active" ? "success" : "secondary"}>
                                    {membership.status}
                                  </Badge>
                                </p>

                                <p className="mb-1">
                                  <strong>Package:</strong>{" "}
                                  {membership.package_id && PACKAGE_MAP[membership.package_id] ? (
                                    <>
                                      <Badge bg="info" className="me-2">
                                        {PACKAGE_MAP[membership.package_id].userType}
                                      </Badge>
                                      <Badge bg="dark">
                                        {PACKAGE_MAP[membership.package_id].duration}
                                      </Badge>
                                    </>
                                  ) : (
                                    "-"
                                  )}
                                </p>

                                <p className="mb-1">
                                  <strong>Start:</strong> {formatDateTime(membership.start_date)}
                                </p>
                                <p className="mb-0">
                                  <strong>End:</strong> {formatDateTime(membership.end_date)}
                                </p>
                              </Col>

                              {/* PERSONAL INFO */}
                              <Col md={6}>
                                <h6 className="text-success mb-2">👤 Personal Info</h6>
                                <p className="mb-1">
                                  <strong>User Type:</strong> {membership.membership_info?.user_type || "-"}
                                </p>
                                <p className="mb-1">
                                  <strong>Faculty:</strong> {membership.membership_info?.faculty || "-"}
                                </p>
                                <p className="mb-1">
                                  <strong>Major:</strong> {membership.membership_info?.major || "-"}
                                </p>
                                <p className="mb-0">
                                  <strong>Student ID / Dept:</strong>{" "}
                                  {membership.membership_info?.student_id ||
                                    membership.membership_info?.department ||
                                    "-"}
                                </p>
                              </Col>
                            </Row>

                            <hr />

                            {/* EMERGENCY */}
                            <h6 className="text-danger mb-2">🚨 Emergency Contact</h6>
                            <p className="mb-1">
                              <strong>Name:</strong> {membership.membership_info?.emergency_name || "-"}
                            </p>
                            <p className="mb-0">
                              <strong>Phone:</strong> {membership.membership_info?.emergency_phone || "-"}
                            </p>

                            <hr />

                            {/* EXTRA */}
                            <p className="mb-0 text-muted">
                              <strong>Known From:</strong>{" "}
                              {membership.membership_info?.known_from || "-"}
                            </p>
                          </div>
                        ) : (
                          <p className="text-muted m-3">No membership data</p>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </Table>

      {/* DELETE MODAL */}
      <Modal show={showDeleteModal} onHide={closeDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            ยืนยันการลบผู้ใช้
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            คุณต้องการลบ <strong>@{selectedUser?.username}</strong> ใช่หรือไม่
          </p>

          <Form.Group>
            <Form.Label>กรอกรหัสผ่านเพื่อยืนยัน</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            ยกเลิก
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteUser}
            disabled={loading}
          >
            {loading ? "กำลังลบ..." : "ยืนยันลบ"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}