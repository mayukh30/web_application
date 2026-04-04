import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('myjobs');
  const [formData, setFormData] = useState({ title: '', company: '', location: '', description: '', salary: '', skills: '' });
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { apiStr } = useContext(AuthContext);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${apiStr}/jobs/myjobs`);
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiStr}/jobs`, formData);
      setMessage('✅ Job posted successfully! Candidates can now apply.');
      setFormData({ title: '', company: '', location: '', description: '', salary: '', skills: '' });
      fetchJobs();
      setActiveTab('myjobs');
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error posting job');
    }
  };

  const viewApplications = async (job) => {
    setSelectedJob(job);
    setAppsLoading(true);
    try {
      const res = await axios.get(`${apiStr}/applications/job/${job._id}`);
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAppsLoading(false);
    }
  };

  const totalApps = jobs.reduce((acc, j) => acc, 0);

  if (loading) return <div className="loader"></div>;

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Recruiter Hub</h1>
          <p className="dashboard-subtitle">{jobs.length} active posting{jobs.length !== 1 ? 's' : ''} · Manage your pipeline</p>
        </div>
        <div className="tab-group">
          <button className={`tab-btn ${activeTab === 'myjobs' ? 'active' : ''}`} onClick={() => { setActiveTab('myjobs'); setSelectedJob(null); }}>My Postings</button>
          <button className={`tab-btn ${activeTab === 'postjob' ? 'active' : ''}`} onClick={() => setActiveTab('postjob')}>+ Post a Job</button>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      {/* Post Job Form */}
      {activeTab === 'postjob' && (
        <div className="card post-job-form animate-fade-in">
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Create New Posting</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Fill in the details below to publish your job listing.</p>
          </div>
          <form onSubmit={handlePostJob}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input type="text" className="form-input" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Senior Frontend Engineer" />
              </div>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input type="text" className="form-input" required value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} placeholder="e.g. Acme Corp" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Location</label>
                <input type="text" className="form-input" required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. Remote · New York, NY" />
              </div>
              <div className="form-group">
                <label className="form-label">Salary Range</label>
                <input type="text" className="form-input" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} placeholder="e.g. $90k – $130k / year" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Required Skills</label>
              <input type="text" className="form-input" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} placeholder="e.g. React, Node.js, PostgreSQL (comma separated)" />
            </div>
            <div className="form-group">
              <label className="form-label">Job Description</label>
              <textarea className="form-input" required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Describe responsibilities, requirements, and what makes this role exciting..." style={{ minHeight: 140 }} />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: 22 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setActiveTab('myjobs')}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ minWidth: 140 }}>Publish Job →</button>
            </div>
          </form>
        </div>
      )}

      {/* My Jobs */}
      {activeTab === 'myjobs' && !selectedJob && (
        <>
          {jobs.length === 0 ? (
            <div className="card empty-state">
              <div className="empty-icon">📋</div>
              <h3>No job postings yet</h3>
              <p style={{ marginBottom: 20 }}>Create your first posting to start receiving applications.</p>
              <button className="btn btn-primary" onClick={() => setActiveTab('postjob')}>Post Your First Job</button>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map(job => {
                const postedDate = new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                return (
                  <div key={job._id} className="card job-card">
                    <div className="job-card-header">
                      <div>
                        <div className="job-title">{job.title}</div>
                        <div className="job-company">{job.company}</div>
                      </div>
                      <div className="job-company-logo">{job.company.charAt(0)}</div>
                    </div>

                    <div className="job-meta">
                      <div className="job-meta-item">📍 {job.location}</div>
                      {job.salary && <div className="job-meta-item">💰 {job.salary}</div>}
                    </div>

                    {job.skills && job.skills.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                        {job.skills.map((s, i) => <span key={i} className="tag">{s}</span>)}
                      </div>
                    )}

                    <p className="job-description">
                      {job.description.length > 100 ? job.description.slice(0, 100) + '…' : job.description}
                    </p>

                    <div className="job-footer">
                      <span className="job-posted">Posted {postedDate}</span>
                      <button className="btn btn-cyan btn-sm" onClick={() => viewApplications(job)}>
                        View Applications
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Applications View */}
      {activeTab === 'myjobs' && selectedJob && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setSelectedJob(null)}>← Back</button>
            <div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 800 }}>{selectedJob.title}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{selectedJob.company} · {selectedJob.location}</p>
            </div>
            <span className="tag" style={{ marginLeft: 'auto' }}>{applications.length} applicant{applications.length !== 1 ? 's' : ''}</span>
          </div>

          {appsLoading ? (
            <div className="loader"></div>
          ) : applications.length === 0 ? (
            <div className="card empty-state">
              <div className="empty-icon">📭</div>
              <h3>No applications yet</h3>
              <p>Share your job posting to attract candidates!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {applications.map(app => (
                <div key={app._id} className="card card-flat" style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: 16, color: 'white', flexShrink: 0
                      }}>
                        {app.applicant?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{app.applicant?.name}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{app.applicant?.email}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>
                      Applied {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>

                  {app.skills && app.skills.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                      {app.skills.map((s, i) => <span key={i} className="tag tag-success">{s}</span>)}
                    </div>
                  )}

                  <div className="cover-letter-box">
                    <div style={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 8 }}>Cover Letter</div>
                    {app.coverLetter}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
