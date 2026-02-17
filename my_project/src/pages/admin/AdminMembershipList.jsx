import React, { useEffect, useState, useCallback } from "react";
import { Table, Container, Button, Badge, Spinner, Alert } from "react-bootstrap";
import Cookies from "js-cookie";

export default function AdminMembershipList() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = Cookies.get("token");

  // โหลดข้อมูล
  const loadMemberships = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/api/v1/memberships", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("โหลดข้อมูลไม่สำเร็จ");

      const data = await res.json();
      setMemberships(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadMemberships();
  }, [loadMemberships]);

  // 🔹 Approve
  const handleApprove = async (id) => {
    if (!window.confirm("ยืนยันการอนุมัติสมาชิกนี้?")) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/memberships/${id}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Approve failed");

      loadMemberships();
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 Reject
  const handleReject = async (id) => {
    if (!window.confirm("ต้องการปฏิเสธคำขอนี้หรือไม่?")) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/memberships/${id}/reject`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Reject failed");

      loadMemberships();
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 Cancel (เฉพาะ active)
  const handleCancel = async (id) => {
    if (!window.confirm("ต้องการยกเลิก Membership นี้หรือไม่?")) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/memberships/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Cancel failed");

      loadMemberships();
    } catch (err) {
      alert(err.message);
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge bg="warning">Pending</Badge>;
      case "active":
        return <Badge bg="success">Active</Badge>;
      case "rejected":
        return <Badge bg="dark">Rejected</Badge>;
      case "cancelled":
        return <Badge bg="danger">Cancelled</Badge>;
      case "expired":
        return <Badge bg="secondary">Expired</Badge>;
      default:
        return <Badge bg="light">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2>จัดการคำขอสมาชิก</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Package</th>
            <th>Duration</th>
            <th>Status</th>
            <th width="220">Action</th>
          </tr>
        </thead>

        <tbody>
          {memberships.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                ไม่พบข้อมูล
              </td>
            </tr>
          ) : (
            memberships.map((m, index) => (
              <tr key={m.membership_id}>
                <td>{index + 1}</td>
                <td>
                  {m.user?.full_name} <br />
                  <small>@{m.user?.username}</small>
                </td>
                <td>{m.package?.user_type}</td>
                <td>{m.package?.duration} เดือน</td>
                <td>{statusBadge(m.status)}</td>
                <td>
                  {m.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="success"
                        className="me-2"
                        onClick={() => handleApprove(m.membership_id)}
                      >
                        Approve
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleReject(m.membership_id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}

                  {m.status === "active" && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleCancel(m.membership_id)}
                    >
                      Cancel
                    </Button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
}
