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
            <div className="brand-logo">⚡</div>
            Lumina Jobs
          </Link>
        </div>
        <ul className="nav-links">
          {user ? (
            <>
              <li>
                <div className="user-badge">
                  <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                  {user.name.split(' ')[0]}
                  <span className={`role-badge ${user.role}`}>{user.role}</span>
                </div>
              </li>
              <li>
                <Link to={user.role === 'recruiter' ? '/recruiter' : '/seeker'} className="nav-item">
                  Dashboard
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                  Sign out
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="nav-item">Login</Link></li>
              <li><Link to="/register" className="btn btn-primary btn-sm">Get Started</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
