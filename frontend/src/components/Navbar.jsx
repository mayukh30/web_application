import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="navbar-brand">
          <Link to="/">
            <span className="brand-icon">🌟</span>
            Lumina Jobs
          </Link>
        </div>
        <ul className="nav-links">
          {user ? (
            <>
              <li>
                <span className="nav-item">Hi, {user.name}</span>
              </li>
              <li>
                <Link to={user.role === 'recruiter' ? '/recruiter' : '/seeker'} className="nav-item">
                  Dashboard
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '6px 16px' }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="nav-item">Login</Link>
              </li>
              <li>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
