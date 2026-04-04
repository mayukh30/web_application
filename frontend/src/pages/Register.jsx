import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'seeker' });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, email, password, role } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(formData);
      if (user.role === 'recruiter') navigate('/recruiter');
      else navigate('/seeker');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="card auth-card">
        <div className="auth-header">
          <h1>Join Lumina</h1>
          <p>Create your account to get started</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" name="name" value={name} onChange={onChange} required placeholder="Jane Doe" />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" name="email" value={email} onChange={onChange} required placeholder="jane@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" name="password" value={password} onChange={onChange} required placeholder="••••••••" />
          </div>
          <div className="form-group">
            <label className="form-label">I am a</label>
            <select className="form-input" name="role" value={role} onChange={onChange} style={{ cursor: 'pointer' }}>
              <option value="seeker">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            Create Account
          </button>
        </form>
        
        <p className="text-center mt-6 text-secondary" style={{ fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-hover)' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
