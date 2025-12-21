import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useLocation } from "react-router-dom";

export default function PackageInfo() {
  const { state } = useLocation();
  const { duration, userType, price } = state || {};

  return (
    <Container className="py-5">
      <h2 className="mb-4">สมัครแพ็กเกจ</h2>

      <Card className="p-4 mb-4 shadow-sm">
        <h5>แพ็กเกจที่คุณเลือก</h5>
        <p><strong>ประเภทผู้ใช้:</strong> {userType}</p>
        <p><strong>ระยะเวลา:</strong> {duration}</p>
        <p><strong>ราคา:</strong> {price} บาท</p>
      </Card>

      <Row className="g-4">
        {/* Left — Upload Document */}
        <Col md={6}>
          <Card className="shadow-sm p-3" style={{ borderRadius: "16px" }}>
            <h5 className="mb-3">เอกสาร</h5>
            <div
              style={{
                width: "100%",
                height: "420px",
                border: "2px dashed #aaa",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#777",
                backgroundColor: "#fafafa",
              }}
            >
              Document Image Preview
            </div>
          </Card>
          <Card className="shadow-sm p-4 mt-4" style={{ borderRadius: "16px" }}>
            <h5 className="mb-3">แบบสอบถามความพร้อมในการออกกำลังกาย</h5>
            <p className="text-muted" style={{ fontSize: "0.9rem" }}>
              โปรดตอบคำถามต่อไปนี้ (ถ้าไม่ตอบ ถือว่าท่านไม่เคย)
            </p>

            {[
              "แพทย์เคยวินิจฉัยท่านว่ามีความผิดปกติของหัวใจ และควรออกกำลังกายภายใต้คำแนะนำของแพทย์หรือไม่",
              "ท่านมีอาการเจ็บหน้าอก ขณะออกกำลังกายหรือไม่",
              "ในเดือนที่ผ่านมา ท่านมีอาการเจ็บหน้าอก ขณะพักอยู่โดยไม่ได้ออกกำลังกายหรือไม่",
              "ท่านมีอาการสูญเสียการทรงตัว (เช่น เวียนศีรษะ) หรือหมดสติหรือไม่",
              "ท่านมีปัญหากระดูกหรือข้อต่อ ซึ่งจะมีอาการแย่ลงเมื่อออกกำลังกายหรือไม่",
              "แพทย์เคยวินิจฉัยว่าท่านมีภาวะความดันโลหิตสูง หรือโรคหัวใจหรือไม่",
              "ท่านทราบหรือไม่ว่ามีเหตุผลอื่นใดที่ทำให้ท่านไม่สามารถออกกำลังกายได้",
            ].map((question, index) => (
              <Form.Group key={index} className="mb-3">
                <Form.Label>
                  {index + 1}. {question}
                </Form.Label>
                <div className="d-flex gap-4 mt-1">
                  <Form.Check
                    inline
                    type="radio"
                    name={`parq_${index}`}
                    label="ไม่เคย"
                  />
                  <Form.Check
                    inline
                    type="radio"
                    name={`parq_${index}`}
                    label="เคย"
                  />
                </div>
              </Form.Group>
            ))}

            <hr />

            <Form.Check
              type="checkbox"
              label="ข้าพเจ้ายอมรับและรับรองว่าข้อมูลดังกล่าวข้างต้นเป็นความจริงทุกประการ และยินยอมปฏิบัติตามระเบียบของศูนย์ SU.ED Fitness Center"
            />
          </Card>

        </Col>

        {/* Right — Form */}
        <Col md={6}>
          <Card className="shadow-sm p-4" style={{ borderRadius: "16px" }}>
            <h5 className="mb-3">ข้อมูลผู้สมัคร</h5>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>ชื่อ - นามสกุล</Form.Label>
                <Form.Control type="text" placeholder="กรอกชื่อและนามสกุล" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>วันเดือนปีเกิด</Form.Label>
                <Form.Control type="date" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>ที่อยู่ปัจจุบัน</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="กรอกที่อยู่ปัจจุบัน"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>เพศ</Form.Label>
                <Form.Select>
                  <option value="">-- เลือกเพศ --</option>
                  <option value="male">ชาย</option>
                  <option value="female">หญิง</option>
                  <option value="other">อื่น ๆ</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>โทรศัพท์</Form.Label>
                <Form.Control type="tel" placeholder="กรอกเบอร์โทรศัพท์" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>E-mail</Form.Label>
                <Form.Control type="email" placeholder="example@email.com" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>LINE ID</Form.Label>
                <Form.Control type="text" placeholder="กรอก LINE ID" />
              </Form.Group>

              <Button
                variant="dark"
                className="px-4 py-2 w-100 mt-3 rounded-pill"
                onClick={() => window.print()}
              >
                Print Document
              </Button>
            </Form>
          </Card>
          <Card className="shadow-sm p-4 mt-4" style={{ borderRadius: "16px" }}>
            <h5 className="mb-3">ข้อมูลการสมัครสมาชิก</h5>

            {/* ประเภทสมาชิก */}
            <Form.Group className="mb-3">
              <Form.Label>ประเภทสมาชิก</Form.Label>

              <Form.Check
                type="radio"
                name="memberType"
                label="นักศึกษามหาวิทยาลัยศิลปากร"
              />
              <Form.Check
                type="radio"
                name="memberType"
                label="นักเรียนสาธิตมหาวิทยาลัยศิลปากร"
              />
              <Form.Check
                type="radio"
                name="memberType"
                label="บุคลากรของคณะศึกษาศาสตร์"
              />
              <Form.Check
                type="radio"
                name="memberType"
                label="บุคลากรของมหาวิทยาลัยศิลปากร"
              />
              <Form.Check
                type="radio"
                name="memberType"
                label="บุคคลภายนอก"
              />
            </Form.Group>

            {/* วัตถุประสงค์ในการใช้บริการ */}
            <Form.Group className="mb-3">
              <Form.Label>วัตถุประสงค์ในการใช้บริการ (เลือกได้มากกว่า 1 ข้อ)</Form.Label>

              <Form.Check type="checkbox" label="เพื่อเสริมสร้างและพัฒนากล้ามเนื้อ" />
              <Form.Check type="checkbox" label="เพื่อลดไขมันส่วนเกิน กระชับสัดส่วน" />
              <Form.Check type="checkbox" label="ออกกำลังกายเพื่อป้องกันโรค" />
              <Form.Check type="checkbox" label="พัฒนาสมรรถภาพทางกายเพื่อใช้ในการแข่งขันกีฬา" />
              <Form.Check type="checkbox" label="เพื่อผ่อนคลายความเครียดจากการทำงาน" />
              <Form.Check type="checkbox" label="อื่น ๆ" />
            </Form.Group>

            {/* โรคประจำตัว */}
            <Form.Group className="mb-3">
              <Form.Label>ท่านมีโรคประจำตัวหรือไม่</Form.Label>
              <Form.Check type="radio" name="disease" label="ไม่มี" />
              <Form.Check type="radio" name="disease" label="มี (โปรดระบุ)" />
              <Form.Control
                type="text"
                className="mt-2"
                placeholder="ระบุโรคประจำตัว"
              />
            </Form.Group>
          </Card>

        </Col>
      </Row>
    </Container>
  );
}
