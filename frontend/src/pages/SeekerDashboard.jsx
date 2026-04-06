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
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [message, setMessage] = useState('');
  const { apiStr } = useContext(AuthContext);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        axios.get(`${apiStr}/jobs`),
        axios.get(`${apiStr}/applications/myapplications`)
      ]);
      setJobs(jobsRes.data);
      setMyApplications(appsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiStr}/applications/${applyJobId}`, { coverLetter, skills: applicantSkills });
      setMessage('🎉 Application submitted! The recruiter has been notified.');
      setApplyJobId(null);
      setCoverLetter('');
      setApplicantSkills('');
      fetchData();
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error submitting application');
    }
  };

  if (loading) return <div className="loader"></div>;

  const uniqueLocations = [...new Set(jobs.map(j => j.location))].sort();
  const uniqueCompanies = [...new Set(jobs.map(j => j.company))].sort();
  const uniqueTitles   = [...new Set(jobs.map(j => j.title))].sort();

  const filteredJobs = jobs.filter(job => {
    const s = searchTerm.toLowerCase();
    const matchesSearch = !s ||
      job.title.toLowerCase().includes(s) ||
      job.company.toLowerCase().includes(s) ||
      (job.skills && job.skills.some(sk => sk.toLowerCase().includes(s)));
    return (
      matchesSearch &&
      (!locationFilter || job.location === locationFilter) &&
      (!titleFilter    || job.title    === titleFilter) &&
      (!companyFilter  || job.company  === companyFilter)
    );
  });

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Job Board</h1>
          <p className="dashboard-subtitle">{jobs.length} open positions · {myApplications.length} applied</p>
        </div>
        <div className="tab-group">
          <button className={`tab-btn ${activeTab === 'browse' ? 'active' : ''}`} onClick={() => setActiveTab('browse')}>Browse Jobs</button>
          <button className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>
            My Applications {myApplications.length > 0 && <span style={{ background: 'var(--primary-color)', color: 'white', borderRadius: '9999px', padding: '1px 7px', fontSize: 11, marginLeft: 4 }}>{myApplications.length}</span>}
          </button>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <>
          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="filter-row">
              <div className="filter-cell" style={{ flex: 2, minWidth: 200 }}>
                <div className="filter-label">Search</div>
                <div className="search-input-wrapper">
                  <span className="search-icon">🔍</span>
                  <input type="text" className="form-input search-input" placeholder="Title, company, or skills..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
              </div>
              <div className="filter-cell">
                <div className="filter-label">Location</div>
                <select className="form-input" value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
                  <option value="">All Locations</option>
                  {uniqueLocations.map((l, i) => <option key={i} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="filter-cell">
                <div className="filter-label">Job Title</div>
                <select className="form-input" value={titleFilter} onChange={e => setTitleFilter(e.target.value)}>
                  <option value="">All Titles</option>
                  {uniqueTitles.map((t, i) => <option key={i} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="filter-cell">
                <div className="filter-label">Company</div>
                <select className="form-input" value={companyFilter} onChange={e => setCompanyFilter(e.target.value)}>
                  <option value="">All Companies</option>
                  {uniqueCompanies.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            {(searchTerm || locationFilter || titleFilter || companyFilter) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredJobs.length}</strong> of {jobs.length} jobs
                </span>
                <button className="btn btn-ghost btn-sm" onClick={() => { setSearchTerm(''); setLocationFilter(''); setTitleFilter(''); setCompanyFilter(''); }}>
                  ✕ Clear filters
                </button>
              </div>
            )}
          </div>

          {/* Jobs Grid */}
          <div className="jobs-grid">
            {jobs.length === 0 ? (
              <div style={{ gridColumn: '1 / -1' }}>
                <div className="card empty-state">
                  <div className="empty-icon">💼</div>
                  <h3>No jobs available yet</h3>
                  <p>Check back soon — new positions are added daily.</p>
                </div>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div style={{ gridColumn: '1 / -1' }}>
                <div className="card empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3>No jobs match your filters</h3>
                  <p>Try adjusting or clearing your search criteria.</p>
                </div>
              </div>
            ) : (
              filteredJobs.map(job => {
                const hasApplied = myApplications.some(app => app.job._id === job._id);
                const companyInitial = job.company.charAt(0).toUpperCase();
                const postedDate = new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                return (
                  <div key={job._id} className="card job-card">
                    {/* Header */}
                    <div className="job-card-header">
                      <div style={{ flex: 1 }}>
                        <div className="job-title">{job.title}</div>
                        <div className="job-company">{job.company}</div>
                      </div>
                      <div className="job-company-logo">{companyInitial}</div>
                    </div>

                    {/* Meta */}
                    <div className="job-meta">
                      <div className="job-meta-item">📍 {job.location}</div>
                      {job.salary && <div className="job-meta-item">💰 {job.salary}</div>}
                    </div>

                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                        {job.skills.map((skill, i) => (
                          <span key={i} className="tag">{skill}</span>
                        ))}
                      </div>
                    )}

                    {/* Description */}
                    <p className="job-description">
                      {job.description.length > 120 ? job.description.slice(0, 120) + '…' : job.description}
                    </p>

                    {/* Apply Form */}
                    {applyJobId === job._id ? (
                      <form onSubmit={handleApply} className="apply-form">
                        <div className="form-group mb-4">
                          <label className="form-label">Paste your resume in here !! </label>
                          <textarea className="form-input" placeholder="Why are you a great fit for this role?" value={coverLetter} onChange={e => setCoverLetter(e.target.value)} required style={{ minHeight: 90 }} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Your Skills</label>
                          <input type="text" className="form-input" placeholder="e.g. React, Python, SQL (comma separated)" value={applicantSkills} onChange={e => setApplicantSkills(e.target.value)} />
                        </div>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setApplyJobId(null)}>Cancel</button>
                          <button type="submit" className="btn btn-accent btn-sm">Submit Application</button>
                        </div>
                      </form>
                    ) : (
                      <div className="job-footer">
                        <span className="job-posted">Posted {postedDate}</span>
                        {hasApplied
                          ? <span className="tag tag-success">✓ Applied</span>
                          : <button className="btn btn-primary btn-sm" onClick={() => setApplyJobId(job._id)}>Apply Now</button>
                        }
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {myApplications.length === 0 ? (
            <div className="card empty-state">
              <div className="empty-icon">📬</div>
              <h3>No applications yet</h3>
              <p>Browse the job board and apply to your first role!</p>
            </div>
          ) : (
            myApplications.map(app => (
              <div key={app._id} className="application-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{app.job?.title}</h3>
                    <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
                      {app.job?.company} · {app.job?.location}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      Applied {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <span className={`tag ${app.status === 'pending' ? 'tag-warning' : app.status === 'accepted' ? 'tag-success' : 'tag-success'}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
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
