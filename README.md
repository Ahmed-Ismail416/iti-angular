# ITI Student Portal (Angular)

An Angular-based frontend for managing students, departments, and courses, with authentication and role-based access for Admin and Student users.

## Overview

This project is built with:
- Angular 21 Standalone Components
- Angular Router for page navigation
- HttpClient + Interceptor to attach JWT automatically
- Route Guards to protect pages by authentication state and role

## Features

- Login and user registration
- Admin dashboard with key statistics
- Student management (list, create, update, delete)
- Department management (list, create, update, delete)
- Course management (list, create, update, delete)
- View courses by department
- Student home page
- Student profile page

## Authorization

- Admin:
  - Access to: dashboard, students, departments, departments/:id/courses, courses
- Student:
  - Access to: student-home, student-profile
- Any unauthenticated user is redirected to the login page.

## Routes

- /login
- /register
- /dashboard (Admin only)
- /students (Admin only)
- /departments (Admin only)
- /departments/:id/courses (Admin only)
- /courses (Admin only)
- /student-home (Authenticated users)
- /student-profile (Authenticated users)

## Requirements

- Node.js recent version (LTS recommended)
- npm
- Angular CLI (optional, since npx can run Angular commands)

## Installation And Run

1) Install dependencies:

    npm install

2) Start the app locally:

    npm start

3) Open in browser:

    http://localhost:4200

## Useful Commands

- Run development server:

    npm start

- Build for production:

    npm run build

- Build with watch mode:

    npm run watch

## API Configuration

The base API URL is configured in:
- src/environments/environment.ts

Current value:
- https://localhost:7183/api

If your backend runs on a different URL, update apiUrl in environment.ts.

## Used Endpoints

- Auth:
  - POST /api/Auth/login
  - POST /api/Auth/register
- Students:
  - GET /api/Students
  - GET /api/Students/{id}
  - GET /api/Students/my-profile
  - POST /api/Students
  - PUT /api/Students/{id}
  - DELETE /api/Students/{id}
- Department:
  - GET /api/Department?page=1&pageSize=100&search=
  - GET /api/Department/{id}
  - GET /api/Department/{id}/courses
  - POST /api/Department
  - PUT /api/Department/{id}
  - DELETE /api/Department/{id}
- Course:
  - GET /api/Course
  - GET /api/Course/{id}
  - GET /api/Course/by-department/{deptId}
  - POST /api/Course
  - PUT /api/Course/{id}
  - DELETE /api/Course/{id}

## Project Structure (Short)

- src/app/components: pages and UI components
- src/app/services: API integration
- src/app/guards: route protection
- src/app/interceptors: token injection and 401 handling
- src/app/models: type/interface definitions
- src/environments: environment configs

## Notes

- Token and user data are stored in Local Storage.
- On token expiration or HTTP 401, the user is logged out and redirected to login.

