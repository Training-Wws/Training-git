import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './pages/Admin';


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<h2>Welcome to Dashboard</h2>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin/>}/>
        </Route>
      </Routes>
    </Router>
  );
}
