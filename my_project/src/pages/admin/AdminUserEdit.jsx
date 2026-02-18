import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminUserEdit() {
  const { id } = useParams(); // 👈 id จาก url
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);

  // 🔹 ดึงข้อมูลเดิมมาแสดง
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/admin/users/${id}`);
        setForm({
          username: res.data.username,
          email: res.data.email,
          role: res.data.role,
        });
      } catch (err) {
        console.error(err);
        alert("ไม่พบข้อมูลผู้ใช้");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // 🔹 handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 submit แก้ไข
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/users/${id}`, form);
      alert("แก้ไขข้อมูลสำเร็จ");
      navigate("/admin/users");
    } catch (err) {
      console.error(err);
      alert("แก้ไขไม่สำเร็จ");
    }
  };

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;

  return (
    <div className="admin-edit">
      <h2>แก้ไขผู้ใช้</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        </label>

        <label>
          Email
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </label>

        <label>
          Role
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <button type="submit">บันทึกการแก้ไข</button>
      </form>
    </div>
  );
}
