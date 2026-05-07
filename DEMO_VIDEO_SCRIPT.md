# Demo Video Script

Use this as a 2 to 5 minute walkthrough while recording the app.

## 1. Intro

"Hi, this is Team Task Manager, a full-stack web app for team project tracking. It supports authentication, role-based access, project management, task assignment, and dashboard progress tracking."

## 2. Tech Stack

"The frontend is built with React, Vite, React Router, Axios, and Tailwind CSS. The backend uses Node.js, Express, JWT, bcryptjs, and MongoDB with Mongoose."

## 3. Login / Signup

"First I’ll show authentication. A user can sign up or log in, and the app stores a JWT token after successful login. I also have Admin and Member roles for access control."

Demo actions:
- Open the login page
- Show signup or use the seeded admin account
- Mention the token-based protected route flow

## 4. Admin Features

"As an Admin, I can create projects, assign multiple team members, and create tasks inside a project. The task form also lets me choose assignee, due date, and status."

Demo actions:
- Open Dashboard as Admin
- Create a project
- Create a task and assign it to a project member
- Show the task list updating after save

## 5. Dashboard Tracking

"The dashboard shows total tasks, pending tasks, in progress tasks, completed tasks, overdue tasks, and my tasks. This gives a quick project health overview."

Demo actions:
- Point to the summary cards
- Show an overdue task if available
- Show status updates in the table

## 6. Role-Based Access

"Role-based access is enforced on the backend. Admin users can manage projects and tasks, while members can only access allowed data and update task status where permitted."

Demo actions:
- Mention protected API routes
- Switch to a member account if you want to demonstrate limited access

## 7. Deployment

"The app is deployed on Railway. The backend uses environment variables for MongoDB, JWT, and the client URL, and the frontend points to the Railway API URL."

Demo actions:
- Open the live URL
- Mention that the app works in production

## 8. Closing

"That’s the Team Task Manager. It covers authentication, role-based team management, project and task workflows, and dashboard progress tracking. Thank you."

## Quick Talking Points

- REST APIs are implemented for auth, projects, tasks, and users
- MongoDB relationships connect users, projects, and tasks
- Protected routes keep data access secure
- Seed data is available for quick demo login