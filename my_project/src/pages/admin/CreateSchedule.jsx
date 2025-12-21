import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import axiosInstance from '../../axiosInstance';

const CreateSchedule = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);

    const mode = params.get('mode'); // add | edit
    const classId = params.get('id');
    const defaultDay = params.get('day');
    const defaultTime = params.get('time');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        class_type: '',
        description: '',
        day_of_week: defaultDay || 'Monday',
        time: defaultTime || '07:00',
        instructor_id: '',
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [instructors, setInstructors] = useState([]);

    /* ================= โหลดผู้สอน ================= */
    useEffect(() => {
        axiosInstance.get('/instructors')
            .then(res => setInstructors(res.data))
            .catch(err => console.error('❌ โหลดผู้สอนล้มเหลว', err));
    }, []);

    /* ================= โหลดข้อมูล (edit) ================= */
    useEffect(() => {
        if (mode === 'edit' && classId) {
            axiosInstance.get(`/classes/${classId}`)
                .then(res => {
                    const cls = res.data;
                    setFormData({
                        name: cls.name || '',
                        class_type: cls.class_type || '',
                        description: cls.description || '',
                        day_of_week: cls.day_of_week || 'Monday',
                        time: cls.time || '07:00',
                        instructor_id: cls.instructor_id || '',
                    });
                    setPreview(cls.image_url || null);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('❌ โหลดข้อมูลคลาสล้มเหลว:', err);
                    alert('ไม่สามารถโหลดข้อมูลคลาสได้');
                    navigate('/admin/schedule');
                });
        } else {
            setLoading(false);
        }
    }, [mode, classId, navigate]);

    /* ================= handle change ================= */
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'image') {
            const file = files[0];
            setImage(file);
            if (file) {
                setPreview(URL.createObjectURL(file));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    /* ================= submit ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value);
            });
            if (image) data.append('image', image);

            if (mode === 'edit') {
                await axiosInstance.put(`/classes/${classId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                });
                alert('แก้ไขคลาสเรียบร้อยแล้ว');
            } else {
                await axiosInstance.post('/classes', data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                });
                alert('เพิ่มคลาสเรียบร้อยแล้ว');
            }

            navigate('/admin/schedule');
        } catch (err) {
            console.error('❌ บันทึกคลาสล้มเหลว:', err);
            alert('เกิดข้อผิดพลาดในการบันทึกคลาส');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" variant="warning" />
                <p className="mt-2 text-muted">กำลังโหลดข้อมูล...</p>
            </div>
        );
    }

    return (
        <Container className="my-5">
            <Row className="mb-3">
                <Col>
                    <h2>{mode === 'edit' ? '✏️ แก้ไขคลาส' : '➕ เพิ่มคลาสใหม่'}</h2>
                </Col>
            </Row>

            <Form onSubmit={handleSubmit} encType="multipart/form-data">

                {/* ชื่อคลาส */}
                <Form.Group className="mb-3">
                    <Form.Label>ชื่อคลาส</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                {/* ประเภท */}
                <Form.Group className="mb-3">
                    <Form.Label>ประเภทคลาส</Form.Label>
                    <Form.Select
                        name="class_type"
                        value={formData.class_type}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- เลือกประเภท --</option>
                        <option value="Cardio">Cardio</option>
                        <option value="Strength">Strength</option>
                        <option value="Flexibility">Flexibility</option>
                    </Form.Select>
                </Form.Group>

                {/* ผู้สอน */}
                <Form.Group className="mb-3">
                    <Form.Label>ผู้สอน</Form.Label>
                    <Form.Select
                        name="instructor_id"
                        value={formData.instructor_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- เลือกผู้สอน --</option>
                        {instructors.map(ins => (
                            <option key={ins.id} value={ins.id}>
                                {ins.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {/* รายละเอียด */}
                <Form.Group className="mb-3">
                    <Form.Label>รายละเอียด</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                    />
                </Form.Group>

                {/* วัน */}
                <Form.Group className="mb-3">
                    <Form.Label>วัน</Form.Label>
                    <Form.Select
                        name="day_of_week"
                        value={formData.day_of_week}
                        onChange={handleChange}
                        required
                    >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                    </Form.Select>
                </Form.Group>

                {/* เวลา */}
                <Form.Group className="mb-3">
                    <Form.Label>เวลา</Form.Label>
                    <Form.Select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                    >
                        <option value="07:00">07:00</option>
                        <option value="17:00">17:00</option>
                        <option value="17:45">17:45</option>
                        <option value="18:00">18:00</option>
                        <option value="19:15">19:15</option>
                    </Form.Select>
                </Form.Group>

                {/* รูป */}
                <Form.Group className="mb-3">
                    <Form.Label>รูปคลาส</Form.Label>
                    <Form.Control
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                    />
                    {preview && (
                        <img
                            src={preview}
                            alt="preview"
                            className="mt-2 rounded"
                            style={{ maxWidth: '200px' }}
                        />
                    )}
                </Form.Group>

                {/* ปุ่ม */}
                <Button type="submit" disabled={saving}>
                    {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                </Button>
                <Button
                    variant="secondary"
                    className="ms-2"
                    onClick={() => navigate('/admin/schedule')}
                >
                    ยกเลิก
                </Button>
            </Form>
        </Container>
    );
};

export default CreateSchedule;
