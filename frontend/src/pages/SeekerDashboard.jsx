import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const SeekerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse');
  const [applyJobId, setApplyJobId] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applicantSkills, setApplicantSkills] = useState('');
  const [message, setMessage] = useState('');
  const { apiStr } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        axios.get(`${apiStr}/jobs`),
        axios.get(`${apiStr}/applications/myapplications`)
      ]);
      setJobs(jobsRes.data);
      setMyApplications(appsRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiStr}/applications/${applyJobId}`, { coverLetter, skills: applicantSkills });
      setMessage('Application submitted successfully!');
      setApplyJobId(null);
      setCoverLetter('');
      setApplicantSkills('');
      fetchData();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error applying');
    }
  };

  if (loading) return <div className="loader mt-6"></div>;

  return (
    <div className="animate-fade-in pb-6">
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Job Seeker Dashboard</h1>
          <p className="text-secondary">Find and apply for your next career move</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className={`btn ${activeTab === 'browse' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('browse')}
          >
            Browse Jobs
          </button>
          <button 
            className={`btn ${activeTab === 'applications' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('applications')}
          >
            My Applications
          </button>
        </div>
      </div>

      {message && <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderRadius: '8px', marginBottom: '20px' }}>{message}</div>}

      {activeTab === 'browse' && (
        <div className="jobs-grid">
          {jobs.map(job => {
            const hasApplied = myApplications.some(app => app.job._id === job._id);
            
            return (
              <div key={job._id} className="card job-card">
                <h3 style={{ fontSize: '20px' }}>{job.title}</h3>
                <div style={{ color: 'var(--primary-hover)', fontWeight: '500', marginTop: '4px' }}>
                  {job.company}
                </div>
                
                <div className="job-meta">
                  <span>📍 {job.location}</span>
                  {job.salary && <span>💰 {job.salary}</span>}
                </div>

                {job.skills && job.skills.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {job.skills.map((skill, index) => (
                      <span key={index} className="tag">{skill}</span>
                    ))}
                  </div>
                )}
                
                <p className="text-secondary mt-2 mb-4" style={{ fontSize: '14px', flex: 1 }}>
                  {job.description}
                </p>

                {applyJobId === job._id ? (
                  <form onSubmit={handleApply} className="mt-4 border-t" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <textarea 
                      className="form-input mb-2" 
                      placeholder="Why are you a great fit? (Cover Letter)"
                      value={coverLetter}
                      onChange={e => setCoverLetter(e.target.value)}
                      required
                    />
                    <input 
                      type="text" 
                      className="form-input mb-4" 
                      placeholder="Your Skills (comma separated)"
                      value={applicantSkills}
                      onChange={e => setApplicantSkills(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button type="button" className="btn btn-outline" onClick={() => setApplyJobId(null)}>Cancel</button>
                      <button type="submit" className="btn btn-accent">Submit Application</button>
                    </div>
                  </form>
                ) : (
                  <div className="job-actions">
                    {hasApplied ? (
                      <span className="tag tag-success">Applied</span>
                    ) : (
                      <button className="btn btn-primary" onClick={() => setApplyJobId(job._id)}>
                        Apply Now
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {jobs.length === 0 && <p className="text-secondary">No jobs available right now.</p>}
        </div>
      )}

      {activeTab === 'applications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {myApplications.length === 0 ? (
            <div className="card text-center text-secondary py-10">
              You haven't applied to any jobs yet.
            </div>
          ) : (
            myApplications.map(app => (
              <div key={app._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '18px' }}>{app.job?.title}</h3>
                  <div className="text-secondary mt-1">at {app.job?.company} • {app.job?.location}</div>
                  <div className="text-muted mt-2" style={{ fontSize: '13px' }}>
                    Applied on: {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span className={`tag ${app.status === 'pending' ? 'tag-warning' : 'tag-success'}`}>
                    {app.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SeekerDashboard;
