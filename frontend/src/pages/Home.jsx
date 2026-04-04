import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page animate-fade-in">
      <div className="hero-content">
        <div className="hero-eyebrow">
          <span></span>
          Now in Beta — Join 2,000+ professionals
        </div>

        <h1 className="hero-title">
          Your next great <br />
          <span className="gradient-text">opportunity</span> starts here.
        </h1>

        <p className="hero-description">
          Lumina connects top talent with world-class companies. Whether you're
          a recruiter building a team or a seeker looking for your dream role —
          we make the match, effortlessly.
        </p>

        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary btn-lg">
            🚀 Start for Free
          </Link>
          <Link to="/login" className="btn btn-outline btn-lg">
            Already have an account
          </Link>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-value">12k+</div>
            <div className="stat-label">Active Jobs</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">3.2k</div>
            <div className="stat-label">Companies</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">98%</div>
            <div className="stat-label">Match Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">48h</div>
            <div className="stat-label">Avg. Response</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
