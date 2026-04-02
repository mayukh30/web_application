const STORAGE_KEY = 'jobportal.jobs';

const fallbackJobs = [
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
        salary: '$120k–$155k', description: "Scale the infrastructure powering millions of web deployments. You'll work on distributed systems, CI/CD pipelines, and cloud architecture.",
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

let jobs = [];
let filteredJobs = [];

const state = {
    query: '',
    category: '',
    location: '',
    type: '',
    minSalary: '',
};

function parseCsvLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let index = 0; index < line.length; index += 1) {
        const character = line[index];

        if (character === '"') {
            if (inQuotes && line[index + 1] === '"') {
                current += '"';
                index += 1;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }

        if (character === ',' && !inQuotes) {
            values.push(current);
            current = '';
            continue;
        }

        current += character;
    }

    values.push(current);
    return values;
}

function parseCsv(text) {
    const lines = text.trim().split(/\r?\n/);
    const headers = parseCsvLine(lines.shift() || '');

    return lines
        .filter(Boolean)
        .map(line => {
            const values = parseCsvLine(line);
            return headers.reduce((record, header, index) => {
                record[header] = values[index] ?? '';
                return record;
            }, {});
        });
}

function parseSalaryRange(salaryText) {
    const numbers = [...salaryText.matchAll(/\d+(?:\.\d+)?/g)].map(match => Number(match[0]));
    if (numbers.length === 0) {
        return { min: 0, max: 0 };
    }

    const values = numbers.map(value => (salaryText.toLowerCase().includes('k') ? value * 1000 : value));
    if (values.length === 1) {
        return { min: values[0], max: values[0] };
    }

    return { min: Math.min(...values), max: Math.max(...values) };
}

function normalizeJob(job) {
    const salaryRange = parseSalaryRange(job.salary || '0');
    return {
        ...job,
        id: job.id ?? Date.now() + Math.floor(Math.random() * 1000),
        category: job.category || 'technology',
        company: job.company || '',
        logo: job.logo || (job.company ? job.company.trim().slice(0, 2).toUpperCase() : 'JP'),
        title: job.title || '',
        location: job.location || '',
        type: job.type || 'Full Time',
        remote: Boolean(job.remote),
        salary: job.salary || '',
        salaryMin: job.salaryMin ?? salaryRange.min,
        salaryMax: job.salaryMax ?? salaryRange.max,
        description: job.description || '',
        tags: Array.isArray(job.tags) ? job.tags : [],
        posted: job.posted || 'Recently',
        featured: Boolean(job.featured),
    };
}

jobs = fallbackJobs.map(normalizeJob);
filteredJobs = [...jobs];

function toBoolean(value) {
    return String(value).toLowerCase() === 'true';
}

function csvRowToJob(row) {
    return normalizeJob({
        id: Number.parseInt(row.id, 10),
        category: row.category,
        company: row.company,
        logo: row.logo,
        title: row.title,
        location: row.location,
        type: row.type,
        remote: toBoolean(row.remote),
        salary: row.salary,
        description: row.description,
        tags: row.tags ? row.tags.split('|').map(tag => tag.trim()).filter(Boolean) : [],
        posted: row.posted,
        featured: toBoolean(row.featured),
    });
}

function getStoredJobs() {
    try {
        const storedJobs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return Array.isArray(storedJobs) ? storedJobs.map(normalizeJob) : [];
    } catch {
        return [];
    }
}

function seedStorage(jobsToStore) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobsToStore.map(normalizeJob)));
}

function getJobs() {
    return jobs;
}

function getFilteredJobs() {
    const jobs = getJobs();

    return jobs.filter(job => {
        const query = state.query.trim().toLowerCase();
        const queryMatch = !query || [job.title, job.company, job.location, job.category, job.type, job.description, ...(job.tags || [])]
            .some(value => String(value).toLowerCase().includes(query));

        const categoryMatch = !state.category || job.category === state.category;
        const locationTerm = state.location.replace(/-/g, ' ');
        const locationMatch = !state.location || job.location.toLowerCase().includes(locationTerm);
        const typeMatch = !state.type || job.type.toLowerCase().replace(/\s+/g, '-') === state.type;
        const salaryMatch = !state.minSalary || job.salaryMax >= state.minSalary;

        return queryMatch && categoryMatch && locationMatch && typeMatch && salaryMatch;
    });
}

function getCategoryJobCount(category) {
    return getJobs().filter(job => job.category === category).length;
}

function updateCategoryCounts() {
    document.querySelectorAll('.category-card').forEach(card => {
        const label = card.querySelector('h3')?.textContent?.trim().toLowerCase();
        const countSpan = card.querySelector('.category-count');
        if (!label || !countSpan) return;

        const count = getCategoryJobCount(label);
        if (count > 0) {
            countSpan.textContent = `${count.toLocaleString()} jobs`;
        }
    });
}

function updateFeaturedBadge() {
    const featuredCount = getJobs().filter(job => job.featured).length;
    const badge = document.querySelector('.hero-badge');
    if (badge) {
        badge.innerHTML = `<i class="fas fa-bolt"></i>${featuredCount.toLocaleString()}+ active listings`;
    }
}

function ensureToastRoot() {
    let toastRoot = document.getElementById('toastRoot');
    if (!toastRoot) {
        toastRoot = document.createElement('div');
        toastRoot.id = 'toastRoot';
        toastRoot.className = 'toast-root';
        document.body.appendChild(toastRoot);
    }
    return toastRoot;
}

function showToast(message) {
    const toastRoot = ensureToastRoot();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastRoot.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    window.setTimeout(() => {
        toast.classList.remove('show');
        window.setTimeout(() => toast.remove(), 200);
    }, 2400);
}

function applyNow(event, jobId) {
    event.stopPropagation();
    const job = getJobs().find(item => item.id === jobId);
    showToast(job ? `Applied successfully for ${job.title}` : 'Applied successfully');
}

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
                    <button class="apply-btn" type="button" onclick="applyNow(event, ${job.id})">Apply Now <i class="fas fa-arrow-right"></i></button>
                </div>
            </div>
        `).join('');
}

function filterJobs(category) {
    state.category = category;
    renderJobs(getFilteredJobs());
    document.getElementById('jobs').scrollIntoView({ behavior: 'smooth' });
}

function applyFilters() {
    state.category = '';
    state.location = document.getElementById('locationFilter').value.toLowerCase();
    state.type = document.getElementById('typeFilter').value.toLowerCase();
    state.minSalary = Number.parseInt(document.getElementById('salaryFilter').value, 10) || '';

    renderJobs(getFilteredJobs());
    document.getElementById('jobs').scrollIntoView({ behavior: 'smooth' });
}

function clearFilters() {
    document.getElementById('locationFilter').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('salaryFilter').value = '';
    state.category = '';
    state.location = '';
    state.type = '';
    state.minSalary = '';
    state.query = '';
    document.getElementById('globalSearch').value = '';
    renderJobs(getFilteredJobs());
}

function updateSearch(query) {
    state.category = '';
    state.query = query;
    renderJobs(getFilteredJobs());
}

function setupEventListeners() {
    const globalSearch = document.getElementById('globalSearch');
    const searchButton = document.querySelector('.search-btn');

    globalSearch?.addEventListener('input', function () {
        updateSearch(this.value);
    });

    searchButton?.addEventListener('click', () => {
        updateSearch(globalSearch.value);
        document.getElementById('jobs').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('jobForm')?.addEventListener('submit', (event) => {
        event.preventDefault();

        const currentJobs = getJobs();
        const company = document.getElementById('jobCompany').value.trim();
        const title = document.getElementById('jobTitle').value.trim();
        const category = document.getElementById('jobCategory').value;
        const location = document.getElementById('jobLocation').value.trim();
        const type = document.getElementById('jobType').value;
        const salary = document.getElementById('jobSalary').value.trim();
        const tags = document.getElementById('jobTags').value.split(',').map(tag => tag.trim()).filter(Boolean);
        const description = document.getElementById('jobDescription').value.trim();

        const newJob = normalizeJob({
            id: Date.now(),
            company,
            logo: company.slice(0, 2).toUpperCase(),
            title,
            category,
            location,
            type,
            remote: /remote/i.test(location),
            salary,
            description,
            tags,
            posted: 'Just now',
            featured: false,
        });

        currentJobs.unshift(newJob);
        jobs = currentJobs;
        seedStorage(jobs);
        event.target.reset();
        document.getElementById('jobCategory').value = 'technology';
        closeModal('employerModal');
        renderJobs(getFilteredJobs());
        updateCategoryCounts();
        updateFeaturedBadge();
    });
}

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

async function initApp() {
    try {
        const response = await fetch('jobs.csv', { cache: 'no-store' });
        const csvText = await response.text();
        const csvJobs = parseCsv(csvText).map(csvRowToJob);
        const storedJobs = getStoredJobs();
        const jobMap = new Map();

        csvJobs.forEach(job => jobMap.set(String(job.id), job));
        storedJobs.forEach(job => jobMap.set(String(job.id), job));

        jobs = Array.from(jobMap.values());

        if (storedJobs.length === 0) {
            seedStorage(jobs);
        }
    } catch {
        const storedJobs = getStoredJobs();
        jobs = storedJobs.length > 0 ? storedJobs : fallbackJobs.map(normalizeJob);

        if (storedJobs.length === 0) {
            seedStorage(jobs);
        }
    }

    updateFeaturedBadge();
    updateCategoryCounts();
    renderJobs(getFilteredJobs());
    setupEventListeners();
}

document.addEventListener('DOMContentLoaded', initApp);