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
- **Database Submissions**: Submissions are stored securely in a MongoDB database instead of relying on third-party email form handlers.
- **Modern UI**: React-based components for a responsive and dynamic user experience.
- **Concurrent Development**: Single command to run both frontend and backend development servers concurrently.

## Setup & Local Development

### Prerequisites

- Node.js (v18+)
- npm
- MongoDB (Local instance or MongoDB Atlas URI)

### 1. Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=
MONGODB_URI=mongodb://localhost:YOUR_MONGO_PORT/YOUR_DATABASE
```

### 2. Installation

Install dependencies for both the frontend and backend:

```bash
cd frontend
npm install
cd ../backend
npm install
cd ..
```

### 3. Running the App

You can start both the frontend and backend concurrently from the root directory using the custom workspace script:

```bash
npm run dev
```

This will concurrently run:

- Frontend Vite development server
- Backend Express development server

## Legacy Code

The original static `index.html` and vanilla JS files have been moved to `legacy_files/` and `_trash/`, and are no longer actively maintained or tracked by Git.
