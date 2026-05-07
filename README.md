
# Team Task Manager

A full-stack team workflow app for creating projects, assigning tasks, tracking progress, and managing access with Admin/Member roles.

## Live Links

- Live URL: add your Railway frontend URL here
- GitHub repo: add your repository URL here

## Features

- Authentication with signup, login, and protected routes
- Role-based access control for Admin and Member users
- Project creation and team member assignment
- Task creation, assignment, status updates, and overdue tracking
- Dashboard with task summary cards and task list
- MongoDB relationships between users, projects, and tasks

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Tailwind CSS
- Backend: Node.js, Express.js, JWT, bcryptjs, Mongoose
- Database: MongoDB

## Project Structure

- `backend/` contains the REST API, validation, middleware, and database models
- `frontend/` contains the React UI for login and the dashboard

## Run Locally

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

## Environment Variables

Create `backend/.env` with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
```

Create `frontend/.env` with:

```env
VITE_API_URL=http://localhost:5000/api
```

## Important API Endpoints

- `POST /api/auth/signup` - create a user account
- `POST /api/auth/login` - log in and receive a JWT
- `GET /api/auth/me` - fetch the current user
- `GET /api/projects` - list accessible projects
- `POST /api/projects` - create a project as Admin
- `GET /api/tasks` - list tasks
- `POST /api/tasks` - create a task as Admin
- `PUT /api/tasks/:id` - update task details or status
- `GET /api/tasks/dashboard/summary` - get dashboard counts
- `GET /api/users` - list users as Admin

## Seeded Demo Accounts

Run the seed script from `backend/` to load sample data:

```bash
npm run seed
```

Seeded logins:

- Admin: `admin@teamtask.local` / `Password123!`
- Member: `neha@teamtask.local` / `Password123!`
- Member: `rohan@teamtask.local` / `Password123!`

## Railway Deployment

1. Push the code to GitHub.
2. Create a Railway project and connect the repository.
3. Deploy the backend service from `backend/`.
4. Add backend variables in Railway: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`.
5. Deploy the frontend service from `frontend/`.
6. Add frontend variable in Railway: `VITE_API_URL` pointing to the deployed backend `/api` URL.
7. Verify signup, login, project creation, task creation, and dashboard counts in production.

## Verification

- Frontend production build: `npm run build` in `frontend/`
- The build completed successfully during local verification.

## Notes

- Admin users can create projects, create tasks, and manage the team.
- Members can view their assigned data and update task status where allowed.
