import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SeekerDashboard from './pages/SeekerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';

const PrivateRoute = ({ children, roleRequired }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="loader mt-6"></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roleRequired && user.role !== roleRequired) return <Navigate to="/" replace />;
  
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/seeker" 
            element={
              <PrivateRoute roleRequired="seeker">
                <SeekerDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/recruiter" 
            element={
              <PrivateRoute roleRequired="recruiter">
                <RecruiterDashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
