import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

export default function PackageInfo() {
  return (
    <Container className="py-5">
      <h2 className="mb-4">Package Information</h2>
      <Row className="g-4">
        {/* Left: Document Image */}
        <Col md={6}>
          <Card className="shadow-sm p-3" style={{ borderRadius: "16px" }}>
            <h5 className="mb-3">Required Document</h5>
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
        </Col>

        {/* Right: Form */}
        <Col md={6}>
          <Card className="shadow-sm p-4" style={{ borderRadius: "16px" }}>
            <h5 className="mb-3">Fill in Your Information</h5>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" placeholder="Enter your full name" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter your email" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="text" placeholder="Enter your phone number" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Additional Notes</Form.Label>
                <Form.Control as="textarea" rows={4} placeholder="Add any notes" />
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
        </Col>
      </Row>
    </Container>
  );
}