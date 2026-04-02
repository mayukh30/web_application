const jobs = [
    {
        id: 1, category: 'technology',
        company: 'Stripe', logo: '💳', title: 'Senior Frontend Engineer',
        location: 'San Francisco', type: 'Full Time', remote: true,
        salary: '$140k–$180k', description: 'Join our platform team to build the future of payments infrastructure. Work with cutting-edge tech stacks in a collaborative environment.',
        tags: ['React', 'TypeScript', 'GraphQL'], posted: '2 days ago', featured: true
    },
    {
        id: 2, category: 'design',
        company: 'Figma', logo: '🎨', title: 'Product Designer',
        location: 'Remote', type: 'Full Time', remote: true,
        salary: '$110k–$140k', description: 'Shape the tools that millions of designers use. Own end-to-end design for core product features from research to polished UI.',
        tags: ['Figma', 'UI/UX', 'Prototyping'], posted: '1 day ago', featured: true
    },
    {
        id: 3, category: 'technology',
        company: 'Vercel', logo: '▲', title: 'DevOps Engineer',
        location: 'New York', type: 'Full Time', remote: false,
        salary: '$120k–$155k', description: 'Scale the infrastructure powering millions of web deployments. You'll work on distributed systems, CI/CD pipelines, and cloud architecture.',
        tags: ['Kubernetes', 'AWS', 'Terraform'], posted: '3 days ago', featured: false
    },
    {
        id: 4, category: 'marketing',
        company: 'HubSpot', logo: '🟠', title: 'Growth Marketing Lead',
        location: 'London', type: 'Full Time', remote: false,
        salary: '£80k–£100k', description: 'Drive user acquisition and retention campaigns for a suite of B2B SaaS tools. Experiment-driven culture with massive impact on growth.',
        tags: ['SEO', 'Paid Ads', 'Analytics'], posted: '5 days ago', featured: false
    },
    {
        id: 5, category: 'finance',
        company: 'Ramp', logo: '💰', title: 'Financial Analyst',
        location: 'Remote', type: 'Contract', remote: true,
        salary: '$90k–$120k', description: 'Analyze financial data and build models to guide strategic decisions for fast-growing fintech company disrupting corporate finance.',
        tags: ['Excel', 'SQL', 'Python'], posted: '1 week ago', featured: false
    },
    {
        id: 6, category: 'technology',
        company: 'Linear', logo: '⚡', title: 'Backend Engineer',
        location: 'San Francisco', type: 'Full Time', remote: true,
        salary: '$130k–$165k', description: 'Build the backbone of the project management tool loved by the best engineering teams. Focus on performance, reliability, and developer experience.',
        tags: ['Node.js', 'PostgreSQL', 'Redis'], posted: '4 days ago', featured: true
    },
];

let filteredJobs = [...jobs];

function renderJobs(data) {
    const grid = document.getElementById('jobsGrid');
    grid.innerHTML = data.length === 0
        ? `<div style="grid-column:1/-1;text-align:center;color:var(--text-dim);padding:4rem">No jobs found matching your filters.</div>`
        : data.map(job => `
            <div class="job-card" onclick="openModal('employerModal')">
                <div class="job-card-top">
                    <div class="company-logo">${job.logo}</div>
                    <div class="job-badges">
                        <span class="badge badge-type">${job.type}</span>
                        ${job.remote ? '<span class="badge badge-remote">Remote</span>' : ''}
                        ${job.featured ? '<span class="badge badge-featured">⭐ Featured</span>' : ''}
                    </div>
                </div>
                <div>
                    <div class="job-company">${job.company}</div>
                    <div class="job-title">${job.title}</div>
                </div>
                <div class="job-meta">
                    <span><i class="fas fa-map-marker-alt"></i>${job.location}</span>
                    <span><i class="fas fa-clock"></i>${job.posted}</span>
                </div>
                <p class="job-description">${job.description}</p>
                <div class="job-tags">
                    ${job.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
                <div class="job-card-footer">
                    <div>
                        <div class="job-salary">${job.salary} <span>/ year</span></div>
                    </div>
                    <button class="apply-btn">Apply Now <i class="fas fa-arrow-right"></i></button>
                </div>
            </div>
        `).join('');
}

function filterJobs(category) {
    filteredJobs = jobs.filter(j => j.category === category);
    renderJobs(filteredJobs);
    document.getElementById('jobs').scrollIntoView({ behavior: 'smooth' });
}

function applyFilters() {
    const loc = document.getElementById('locationFilter').value.toLowerCase();
    const type = document.getElementById('typeFilter').value.toLowerCase();
    document.getElementById('salaryFilter').value;

    filteredJobs = jobs.filter(j => {
        const locMatch = !loc || j.location.toLowerCase().includes(loc.replace('-', ' '));
        const typeMatch = !type || j.type.toLowerCase().replace(' ', '-') === type;
        return locMatch && typeMatch;
    });
    renderJobs(filteredJobs);
    document.getElementById('jobs').scrollIntoView({ behavior: 'smooth' });
}

function clearFilters() {
    document.getElementById('locationFilter').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('salaryFilter').value = '';
    filteredJobs = [...jobs];
    renderJobs(filteredJobs);
}

document.getElementById('globalSearch').addEventListener('input', function () {
    const q = this.value.toLowerCase();
    filteredJobs = jobs.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.tags.some(t => t.toLowerCase().includes(q))
    );
    renderJobs(filteredJobs);
});

function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
});

function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            el.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));

renderJobs(jobs);