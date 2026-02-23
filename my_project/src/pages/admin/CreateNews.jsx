import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Modal, Alert } from 'react-bootstrap';
import axiosInstance from '../../axiosInstance';

const CreateNews = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [type, setType] = useState('general');
  const today = new Date().toISOString().split('T')[0];
  const [publishDate, setPublishDate] = useState(today);

  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // เปิด modal ยืนยัน
  const handleConfirm = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  // บันทึกจริง
  const handleSubmit = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('type', type);
    formData.append('publish_date', new Date(publishDate).toISOString());
    if (image) formData.append('image', image);

    try {
      await axiosInstance.post('/news', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      setVariant('success');
      setMessage('เพิ่มข่าวเรียบร้อยแล้ว');
      setShowConfirm(false);

      setTimeout(() => {
        navigate('/admin/news');
      }, 1200);
    } catch {
      setVariant('danger');
      setMessage('เพิ่มข่าวไม่สำเร็จ');
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={9} lg={8}>
          <Card
            className="shadow-lg"
            style={{
              borderRadius: 20,
              border: '2px solid #FF7F11',
            }}
          >
            <Card.Body className="p-4">
              <h4 className="mb-1" style={{ color: '#FF7F11' }}>
                📰 เพิ่มข่าวใหม่
              </h4>
              <p className="text-muted mb-4">
                ใช้สำหรับประกาศข่าวสารและกิจกรรมของฟิตเนส
              </p>

              {message && (
                <Alert variant={variant} className="mb-3">
                  {message}
                </Alert>
              )}

              <Form onSubmit={handleConfirm}>
                <Form.Group className="mb-3">
                  <Form.Label>หัวข้อข่าว</Form.Label>
                  <Form.Control
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>รูปภาพประกอบ</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                </Form.Group>

                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="mb-3"
                    style={{
                      width: '100%',
                      maxHeight: 260,
                      objectFit: 'cover',
                      borderRadius: 12,
                    }}
                  />
                )}

                <Form.Group className="mb-3">
                  <Form.Label>เนื้อหาข่าว</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>ประเภทข่าว</Form.Label>
                      <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="general">ทั่วไป</option>
                        <option value="health">สุขภาพ</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>วันที่เผยแพร่</Form.Label>
                      <Form.Control
                        type="date"
                        value={publishDate}
                        onChange={(e) => setPublishDate(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2">
                  <Button variant="outline-secondary" onClick={() => navigate('/admin/news')}>
                    ยกเลิก
                  </Button>
                  <Button
                    type="submit"
                    style={{ backgroundColor: '#FF7F11', border: 'none' }}
                  >
                    บันทึกข่าว
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal ยืนยัน */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการบันทึก</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          คุณต้องการบันทึกข่าวนี้ใช่หรือไม่?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            ยกเลิก
          </Button>
          <Button variant="success" onClick={handleSubmit} disabled={loading}>
            {loading ? 'กำลังบันทึก...' : 'ยืนยัน'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CreateNews;