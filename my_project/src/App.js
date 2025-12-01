import './App.css';
import Sliceshow from './components/SliceShow';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Schedule from './pages/Schedule';
import Login from './pages/Login';
import SignIn from './pages/SignIn';
import Packages from './pages/package';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Profile from './pages/Profile';

// หน้า Admin
import DashBoard from './pages/admin/DashBoard'; // ✅ Dashboard
import AdminNews from './pages/admin/AdminNews';
import CreateNews from './pages/admin/CreateNews';
import EditNews from './pages/admin/EditNews';
import AdminSchedule from './pages/admin/AdminSchedule';
import CreateSchedule from './pages/admin/CreateSchedule'; // ✅ เพิ่ม CreateSchedule

// PrivateRoute
import PrivateRoute from './components/PrivateRoute';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        <Routes>
          {/* หน้า Public */}
          <Route
            path="/"
            element={
              <>
                <Sliceshow />
                <News limit={3} />
                <Schedule />
              </>
            }
          />
          <Route path="/news" element={<News />} />
          <Route path="/news/:newsId" element={<NewsDetail />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/package" element={<Packages />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/profile" element={<Profile />} />

          {/* หน้า Admin protected ด้วย PrivateRoute */}
          {/* ✅ หน้าแรกของ admin เป็น Dashboard */}
          <Route
            path="/admin"
            element={
              <PrivateRoute roleRequired="admin">
                <DashBoard />
              </PrivateRoute>
            }
          />

          {/* Admin News */}
          <Route
            path="/admin/news"
            element={
              <PrivateRoute roleRequired="admin">
                <AdminNews />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/news/create"
            element={
              <PrivateRoute roleRequired="admin">
                <CreateNews />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/news/edit/:id"
            element={
              <PrivateRoute roleRequired="admin">
                <EditNews />
              </PrivateRoute>
            }
          />

          {/* Admin Schedule */}
          <Route
            path="/admin/schedule"
            element={
              <PrivateRoute roleRequired="admin">
                <AdminSchedule />
              </PrivateRoute>
            }
          />
          {/* CreateSchedule ใช้สำหรับเพิ่มและแก้ไข */}
          <Route
            path="/admin/schedule/create"
            element={
              <PrivateRoute roleRequired="admin">
                <CreateSchedule />
              </PrivateRoute>
            }
          />
        </Routes>
       <Footer />
      </div>
    </Router>
  );
}

export default App;
