import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('myjobs'); // myjobs, postjob
  const [formData, setFormData] = useState({ title: '', company: '', location: '', description: '', salary: '', skills: '' });
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState('');
  
  const { apiStr } = useContext(AuthContext);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${apiStr}/jobs/myjobs`);
      setJobs(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiStr}/jobs`, formData);
      setMessage('Job posted successfully!');
      setFormData({ title: '', company: '', location: '', description: '', salary: '', skills: '' });
      fetchJobs();
      setActiveTab('myjobs');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error posting job');
    }
  };

  const viewApplications = async (jobId) => {
    try {
      const res = await axios.get(`${apiStr}/applications/job/${jobId}`);
      setApplications(res.data);
      setSelectedJobId(jobId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loader mt-6"></div>;

  return (
    <div className="animate-fade-in pb-6">
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Recruiter Dashboard</h1>
          <p className="text-secondary">Manage your postings and review candidates</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className={`btn ${activeTab === 'myjobs' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setActiveTab('myjobs'); setSelectedJobId(null); }}
          >
            My Postings
          </button>
          <button 
            className={`btn ${activeTab === 'postjob' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('postjob')}
          >
            Post a Job
          </button>
        </div>
      </div>

      {message && <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderRadius: '8px', marginBottom: '20px' }}>{message}</div>}

      {activeTab === 'postjob' && (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '24px' }}>Create New Job Posting</h2>
          <form onSubmit={handlePostJob}>
            <div className="form-group">
              <label className="form-label">Job Title</label>
              <input type="text" className="form-input" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Senior Frontend Engineer" />
            </div>
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input type="text" className="form-input" required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="e.g. Acme Corp" />
            </div>
            <div className="form-group">
              <label className="form-label">Location & Salary</label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <input type="text" className="form-input" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Remote, NY" style={{ flex: 1 }} />
                <input type="text" className="form-input" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} placeholder="e.g. $100k - $120k" style={{ flex: 1 }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Required Skills (comma separated)</label>
              <input type="text" className="form-input" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} placeholder="e.g. React, Node.js, CSS" />
            </div>
            <div className="form-group">
              <label className="form-label">Job Description</label>
              <textarea className="form-input" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Details about role..."></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Post Job</button>
          </form>
        </div>
      )}

      {activeTab === 'myjobs' && !selectedJobId && (
        <div className="jobs-grid">
          {jobs.length === 0 ? (
            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
              <p className="text-secondary mb-4">You haven't posted any jobs yet.</p>
              <button className="btn btn-primary" onClick={() => setActiveTab('postjob')}>Post Your First Job</button>
            </div>
          ) : (
            jobs.map(job => (
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
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {job.skills.map((skill, index) => (
                      <span key={index} className="tag">{skill}</span>
                    ))}
                  </div>
                )}
                
                <div className="job-actions">
                  <button className="btn btn-outline" onClick={() => viewApplications(job._id)}>
                    View Applications
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'myjobs' && selectedJobId && (
        <div>
          <button className="btn btn-outline mb-6" onClick={() => setSelectedJobId(null)}>
            ← Back to Jobs
          </button>
          <div className="card">
            <h2 style={{ marginBottom: '24px' }}>Applications Received ({applications.length})</h2>
            
            {applications.length === 0 ? (
              <p className="text-secondary text-center py-6">No applications received yet for this job.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {applications.map(app => (
                  <div key={app._id} style={{ padding: '16px', background: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '16px' }}>{app.applicant?.name}</h3>
                      <span className="text-muted" style={{ fontSize: '13px' }}>{new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-secondary mb-4" style={{ fontSize: '14px' }}>
                      <strong>Email:</strong> {app.applicant?.email}
                    </div>
                    {app.skills && app.skills.length > 0 && (
                      <div className="mb-4" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {app.skills.map((skill, index) => (
                          <span key={index} className="tag tag-success">{skill}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ padding: '12px', background: 'var(--bg-card)', borderRadius: '6px', fontSize: '14px', borderLeft: '3px solid var(--primary-color)' }}>
                      <strong>Cover Letter:</strong><br/>
                      <span style={{ whiteSpace: 'pre-line' }}>{app.coverLetter}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
