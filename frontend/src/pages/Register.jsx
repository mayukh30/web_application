import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'seeker' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(formData);
      if (user.role === 'recruiter') navigate('/recruiter');
      else navigate('/seeker');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-wrapper">
        {/* Left Panel */}
        <div className="auth-panel-left">
          <div>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✨</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
              Join thousands of professionals
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
              Whether you're hiring or job hunting, Lumina has everything you need to succeed.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="auth-feature">
              <div className="auth-feature-icon">👤</div>
              <div className="auth-feature-text">
                <h4>For Job Seekers</h4>
                <p>Browse curated openings, apply with one click, track your status.</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">🏢</div>
              <div className="auth-feature-text">
                <h4>For Recruiters</h4>
                <p>Post jobs, receive applications, and find the right candidate fast.</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">🔒</div>
              <div className="auth-feature-text">
                <h4>Secure & Private</h4>
                <p>Your data is encrypted and never shared without consent.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-panel-right">
          <div className="auth-form-header">
            <h1>Create Account</h1>
            <p>Join Lumina and shape your career today</p>
          </div>

          {error && <div className="error-message">⚠️ {error}</div>}

          {/* Role Selector */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            {['seeker', 'recruiter'].map(r => (
              <button
                key={r} type="button"
                onClick={() => setFormData({ ...formData, role: r })}
                style={{
                  flex: 1, padding: '12px', borderRadius: 'var(--radius-sm)',
                  border: formData.role === r ? '1.5px solid var(--primary-color)' : '1px solid var(--border-color)',
                  background: formData.role === r ? 'rgba(124,58,237,0.12)' : 'var(--bg-elevated)',
                  color: formData.role === r ? 'var(--primary-light)' : 'var(--text-secondary)',
                  cursor: 'pointer', fontWeight: 600, fontSize: 14,
                  transition: 'all 0.18s ease',
                }}
              >
                {r === 'seeker' ? '🔍 Job Seeker' : '🏢 Recruiter'}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" name="name" value={formData.name} onChange={onChange} required placeholder="Jane Doe" />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" name="email" value={formData.email} onChange={onChange} required placeholder="jane@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" name="password" value={formData.password} onChange={onChange} required placeholder="Create a strong password" />
            </div>
            <button type="submit" className="btn btn-primary btn-full" style={{ padding: '13px' }} disabled={loading}>
              {loading ? 'Creating account...' : `Join as ${formData.role === 'seeker' ? 'Job Seeker' : 'Recruiter'} →`}
            </button>
          </form>

          <div className="divider"></div>
          <p className="text-center" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
