import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(formData);
      if (user.role === 'recruiter') navigate('/recruiter');
      else navigate('/seeker');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="card auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to your Lumina account</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              name="email" 
              value={email} 
              onChange={onChange} 
              required 
              placeholder="hello@example.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              name="password" 
              value={password} 
              onChange={onChange} 
              required 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            Sign In
          </button>
        </form>
        
        <p className="text-center mt-6 text-secondary" style={{ fontSize: '14px' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-hover)' }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
