# PB Client Briefing

A client-facing website briefing tool and question guide. Clients fill out a multi-section form covering their business, goals, design preferences, and practical details, then submit it.

## Architecture

This project has been modernized from a static HTML/JS application to a full **MERN stack** (MongoDB, Express, React, Node.js) application.

The workspace is divided into two main directories:

- **`frontend/`**: A React application built with Vite and React Router.
- **`backend/`**: An Express server connected to a MongoDB database to store client submissions.

### Tech Stack

- **Frontend**: React (v18), React Router, Vite
- **Backend**: Node.js, Express, Mongoose, dotenv, cors
- **Database**: MongoDB

## Features

- **Interactive Question Guides**: Specific routing for different clients.
- **Database Submissions**: All three forms save validated answers in MongoDB. No email is sent automatically. `/admin` reviews saved briefs using a server-only token.
- **Recovery**: Browser drafts, complete printable summaries and text downloads when pop-ups are blocked. Failed saves retain answers.
- **Modern UI**: React-based components for a responsive and dynamic user experience.
- **Concurrent Development**: Single command to run both frontend and backend development servers concurrently.

## Setup & Local Development

### Prerequisites

- Node.js (v22+)
- npm
- MongoDB (Local instance or MongoDB Atlas URI)

### 1. Environment Variables

Copy `backend/.env.example` to `backend/.env` without replacing an existing file. Keep credentials server-side. Defaults:

```env
PORT=5001
HOST=127.0.0.1
MONGODB_URI=mongodb://127.0.0.1:27017/pb_client_briefing
ADMIN_TOKEN=
```

### 2. Installation

Install dependencies for both the frontend and backend:

```bash
npm ci --prefix frontend
npm ci --prefix backend
```

### 3. Running the App

You can start both the frontend and backend concurrently from the root directory using the custom workspace script:

```bash
npm run dev
```

This will concurrently run:

- Frontend: `http://127.0.0.1:5173`.
- Backend: `http://127.0.0.1:5001/api/health`; MongoDB must already be running.

See [Local setup, stop, testing and hosting boundaries](docs/local-setup.md) for reproducible commands and data/privacy limitations. Run `npm test` and `npm run build` from the repository root.

## Legacy Code

`legacy_files/` and `_trash/` are ignored, if present. Supported application lives in `frontend/` and `backend/`.
