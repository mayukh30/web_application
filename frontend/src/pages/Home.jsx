import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="auth-container animate-fade-in">
      <div className="text-center" style={{ maxWidth: '600px' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '16px', background: '-webkit-linear-gradient(#fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Find Your Dream Job, <br/> Or The Perfect Candidate.
        </h1>
        <p className="text-secondary mb-6" style={{ fontSize: '18px' }}>
          Lumina pairs top talent with the best companies. Get started today and shape your future with our premium recruitment portal.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '16px' }}>
            Get Started
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ padding: '14px 32px', fontSize: '16px' }}>
            Login Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
