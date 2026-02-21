import React from 'react';
import { Link } from 'react-router-dom';
import Sliceshow from '../components/SliceShow';
import News from './News';
import Schedule from './Schedule';

const Home = () => {
  return (
    <div>
      {/* HERO SECTION */}
      <section className="position-relative">
        <Sliceshow />

        <div
          className="position-absolute top-50 start-50 translate-middle text-center text-white"
          style={{
            background: 'rgba(0,0,0,0.55)',
            padding: '40px',
            borderRadius: '16px',
            maxWidth: '600px',
            width: '90%',
          }}
        >
          <h1 className="fw-bold mb-3">
            ฟิตวันนี้ เพื่อสุขภาพที่ดีกว่า
          </h1>
          <p className="mb-4 fs-5">
            สมัครสมาชิกฟิตเนส พร้อมคลาสออกกำลังกายคุณภาพ
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/package" className="btn btn-primary btn-lg">
              ดูแพ็กเกจ
            </Link>
            <Link to="/signin" className="btn btn-outline-light btn-lg">
              สมัครสมาชิก
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="container my-5">
        <h2 className="text-center fw-bold mb-5">
          ทำไมต้องเลือกเรา
        </h2>

        <div className="row text-center g-4">
          <div className="col-md-4">
            <div className="p-4 shadow-sm rounded-4 h-100">
              <h4 className="mb-3">🏋️‍♂️ อุปกรณ์ครบ</h4>
              <p className="text-muted">
                เครื่องออกกำลังกายมาตรฐานฟิตเนสมืออาชีพ
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 shadow-sm rounded-4 h-100">
              <h4 className="mb-3">👨‍🏫 เทรนเนอร์คุณภาพ</h4>
              <p className="text-muted">
                ดูแลใกล้ชิดทุกคลาส ปลอดภัย เห็นผลจริง
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 shadow-sm rounded-4 h-100">
              <h4 className="mb-3">⏰ ตารางยืดหยุ่น</h4>
              <p className="text-muted">
                เลือกเวลาออกกำลังกายได้ตามไลฟ์สไตล์
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PACKAGE PREVIEW */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-3">
            แพ็กเกจสมาชิก
          </h2>
          <p className="text-muted mb-4">
            เลือกแพ็กเกจที่เหมาะกับคุณที่สุด
          </p>

          <Link to="/package" className="btn btn-primary btn-lg">
            ดูแพ็กเกจทั้งหมด
          </Link>
        </div>
      </section>

      {/* NEWS */}
      <section className="container my-5">
        <h2 className="fw-bold mb-4 text-center">
          ข่าวสาร & โปรโมชั่น
        </h2>
        <News limit={3} hideFilter={true} />
      </section>

      {/* SCHEDULE */}
      <section className="container my-5">
        <h2 className="fw-bold mb-4 text-center">
          ตารางคลาสวันนี้
        </h2>
        <Schedule showGuide={false} />
      </section>

      {/* CTA */}
      <section className="bg-primary text-white text-center py-5">
        <h2 className="fw-bold mb-3">
          พร้อมเริ่มต้นดูแลสุขภาพแล้วหรือยัง?
        </h2>
        <p className="mb-4 fs-5">
          สมัครสมาชิกวันนี้ เพื่อสุขภาพที่ดีในระยะยาว
        </p>

        <Link to="/signin" className="btn btn-light btn-lg">
          สมัครสมาชิกตอนนี้
        </Link>
      </section>
    </div>
  );
};

export default Home;