import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(formData);
      if (user.role === 'recruiter') navigate('/recruiter');
      else navigate('/seeker');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-wrapper">
        {/* Left Panel */}
        <div className="auth-panel-left">
          <div>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
              Welcome back to Lumina
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
              The premium platform for connecting great talent with world-class companies.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="auth-feature">
              <div className="auth-feature-icon">🔍</div>
              <div className="auth-feature-text">
                <h4>Smart Job Matching</h4>
                <p>Discover opportunities tailored to your skills and goals.</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">📬</div>
              <div className="auth-feature-text">
                <h4>Instant Applications</h4>
                <p>Apply in seconds. Recruiters get notified immediately.</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">🏢</div>
              <div className="auth-feature-text">
                <h4>Company Insights</h4>
                <p>Get to know the teams behind every job posting.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-panel-right">
          <div className="auth-form-header">
            <h1>Sign In</h1>
            <p>Enter your credentials to access your dashboard</p>
          </div>

          {error && <div className="error-message">⚠️ {error}</div>}

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email" className="form-input" name="email"
                value={formData.email} onChange={onChange}
                required placeholder="hello@example.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password" className="form-input" name="password"
                value={formData.password} onChange={onChange}
                required placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 4, padding: '13px' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="divider"></div>
          <p className="text-center" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
