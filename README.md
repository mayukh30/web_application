# Job Portal Web Application

## Team Details

DEPARTMENT - INFORMATION TECHNOLOGY
SECTION - A2
YEAR - UG3
DATE - 06/04/2026

TEAM DETAILS :
- Mayukh Sinha - Roll No: 002311001038
- Ankita Dhara - Roll No: 002311001034
- Rounak Mukhopadhyay - Roll No: 002311001040

## Project Overview

This project is a full-stack Job Portal application where:

- Recruiters can register/login and post jobs.
- Seekers can register/login, browse jobs, and apply for jobs.
- Both roles get role-specific dashboards.

## Tech Stack Used

### Frontend

- React 19
- Vite
- React Router DOM
- Axios
- React Icons
- CSS
- ESLint

### Backend

- Node.js
- Express.js
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- CORS
- dotenv
- Nodemon (development)

### Database

- MongoDB

## Folder Structure

```text
web_application/
	backend/
		middleware/
		models/
		routes/
		server.js
		package.json
	frontend/
		src/
			components/
			context/
			pages/
			App.jsx
			main.jsx
		package.json
	README.md
```

## Workflow

### 1. Authentication Flow

1. User registers via `/api/auth/register` with `name`, `email`, `password`, and `role` (`seeker` or `recruiter`).
1. Password is hashed with `bcryptjs` before storing in MongoDB.
1. User logs in via `/api/auth/login`.
1. Backend returns JWT token and user profile data.
1. Frontend stores user session in `localStorage`.
1. Axios interceptor automatically attaches `Authorization: Bearer <token>` for protected requests.

### 2. Role-Based Access Flow

1. Middleware validates token (`protect`).
1. Role guards (`recruiterOnly`, `seekerOnly`) authorize access.
1. Frontend `PrivateRoute` checks login state and role before rendering dashboard routes.

### 3. Job Management Flow (Recruiter)

1. Recruiter creates a new job through protected API `POST /api/jobs`.
1. Required fields are validated (`title`, `company`, `location`, `description`).
1. Recruiter can fetch own jobs via `GET /api/jobs/myjobs`.
1. Public job list is available via `GET /api/jobs`.

### 4. Application Flow (Seeker)

1. Seeker applies for a job via `POST /api/applications/:jobId`.
1. Backend prevents duplicate applications for the same job and seeker.
1. Seeker checks submitted applications via `GET /api/applications/myapplications`.
1. Recruiter reviews job applications via `GET /api/applications/job/:jobId`.

## API Summary

### Auth Routes

- `POST /api/auth/register`
- `POST /api/auth/login`

### Job Routes

- `GET /api/jobs`
- `GET /api/jobs/myjobs` (protected, recruiter only)
- `POST /api/jobs` (protected, recruiter only)

### Application Routes

- `POST /api/applications/:jobId` (protected, seeker only)
- `GET /api/applications/myapplications` (protected, seeker only)
- `GET /api/applications/job/:jobId` (protected, recruiter only)

## MongoDB Schemas

### User Schema

Collection: `users`

| Field | Type | Constraints |
| --- | --- | --- |
| `name` | String | Required |
| `email` | String | Required, Unique |
| `password` | String | Required (hashed) |
| `role` | String | Required, enum: `seeker`, `recruiter` |
| `createdAt` | Date | Auto (timestamps) |
| `updatedAt` | Date | Auto (timestamps) |

### Job Schema

Collection: `jobs`

| Field | Type | Constraints |
| --- | --- | --- |
| `title` | String | Required |
| `company` | String | Required |
| `location` | String | Required |
| `description` | String | Required |
| `salary` | String | Optional |
| `skills` | Array of String | Default: `[]` |
| `recruiter` | ObjectId (`User`) | Required, reference |
| `createdAt` | Date | Auto (timestamps) |
| `updatedAt` | Date | Auto (timestamps) |

### Application Schema

Collection: `applications`

| Field | Type | Constraints |
| --- | --- | --- |
| `job` | ObjectId (`Job`) | Required, reference |
| `applicant` | ObjectId (`User`) | Required, reference |
| `coverLetter` | String | Required |
| `skills` | Array of String | Default: `[]` |
| `status` | String | enum: `pending`, `reviewed`, `accepted`, `rejected`; default: `pending` |
| `createdAt` | Date | Auto (timestamps) |
| `updatedAt` | Date | Auto (timestamps) |

## Frontend Route Map

- `/` -> Home page
- `/login` -> Login page
- `/register` -> Register page
- `/seeker` -> Seeker dashboard (private, seeker role)
- `/recruiter` -> Recruiter dashboard (private, recruiter role)

## How to Run

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Deploy on Vercel (Frontend + Backend as 2 Projects)

This repository is now prepared for deployment as two separate Vercel projects:

1. `frontend` project (React + Vite UI)
1. `backend` project (Express API)

### 1. Deploy Backend on Vercel

1. Go to Vercel dashboard and click **Add New Project**.
1. Import this repository.
1. Set **Root Directory** to `backend`.
1. Framework preset can stay as **Other**.
1. Add environment variables in Vercel Project Settings:
	- `MONGO_URI` = your MongoDB connection string
	- `JWT_SECRET` = a strong secret key
	- `FRONTEND_URL` = your frontend Vercel URL (for CORS), for example `https://your-frontend.vercel.app`
1. Deploy and copy your backend URL, for example:
	- `https://your-backend.vercel.app`
1. Verify backend health:
	- `https://your-backend.vercel.app/api/health`

### 2. Deploy Frontend on Vercel

1. Create another Vercel project from the same repository.
1. Set **Root Directory** to `frontend`.
1. Framework preset should auto-detect as **Vite**.
1. Add environment variable:
	- `VITE_API_URL` = `https://your-backend.vercel.app/api`
1. Deploy.

### 3. Update Backend CORS After Frontend URL Is Final

After frontend deployment, confirm backend env variable:

- `FRONTEND_URL=https://your-frontend.vercel.app`

Then redeploy backend if required.

### 4. Optional: CLI Deploy Commands

You can also deploy from terminal:

```bash
# Backend project
cd backend
vercel

# Frontend project
cd ../frontend
vercel
```

### Notes

- Frontend SPA routing fallback is handled via `frontend/vercel.json`.
- Backend routing to Express handler is handled via `backend/vercel.json`.
- Keep local `.env` files out of git and configure production secrets only in Vercel environment variables.

