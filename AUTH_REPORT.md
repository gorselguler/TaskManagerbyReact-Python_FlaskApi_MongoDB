# Full-Stack Connection & JWT Authentication Report

This document explains the architecture and data flow between the React frontend, the Flask backend, and the MongoDB database, specifically focusing on the newly implemented JWT (JSON Web Token) authentication system.

---

## 1. The Core Architecture

The project follows a **Decoupled Architecture**:
- **Frontend**: React (Vite) running on `http://localhost:5173`
- **Backend**: Flask (Python) running on `http://localhost:5000`
- **Database**: MongoDB (NoSQL) running on `port 27017`

### Communication Flow:
1. **Frontend** makes an `HTTP Request` (GET, POST, etc.) using the `fetch()` API.
2. **Backend** receives the request, validates the user (via JWT), and queries **MongoDB**.
3. **MongoDB** returns data to the Backend.
4. **Backend** sends a `JSON Response` back to the Frontend.

---

## 2. JWT Authentication (The "VIP Pass" System)

JWT (JSON Web Token) is used to securely identify users without storing "sessions" on the server.

### A. The Registration Flow
1. User enters Email/Password in the React Modal.
2. React sends data to `/register`.
3. **Backend Security**: The password is **hashed** using `bcrypt`.
    - *Example*: `my-password` → `$2b$12$K8... (random string)`
4. The user is saved in the `users` collection in MongoDB.

### B. The Login Flow
1. User submits credentials to `/login`.
2. Backend finds the user by email and compares the hashed password.
3. If valid, the Backend generates a **JWT Token**.
    - This token contains the `user_id` and an `expiration time` (24 hours).
4. The token is sent to React, which saves it in `localStorage.setItem('token', ...)`.

### C. The Protected Request Flow
Every time React asks for tasks, it must present the token:
1. React adds a header: `Authorization: Bearer <your_token>`.
2. Backend uses the `@token_required` decorator to:
    - Verify if the token is authentic (signed by our `SECRET_KEY`).
    - Extract the `user_id` from inside the token.
    - Only fetch tasks from MongoDB that belong to that specific `user_id`.

---

## 3. Implementation Details

### Backend Logic (`app/routes.py`)
- **`bcrypt.hashpw()`**: Ensures passwords are never stored in plain text.
- **`jwt.encode()`**: Creates the secure signature.
- **`token_required(f)`**: A custom "Security Guard" function that wraps around private routes.

### Frontend Logic (`src/components/TopBar.jsx`)
- **`localStorage`**: Keeps the user logged in even if the browser is closed.
- **`useState(isLoggedIn)`**: Changes the UI (shows Profile initials instead of "Login" button).
- **`Modal System`**: A custom-built Tailwind component for a seamless auth experience.

---

## 4. Why This Matters
- **Security**: Even if the database is leaked, hackers cannot read user passwords.
- **Privacy**: User A can never see User B's tasks because every database query is filtered by the `user_id` extracted from the encrypted token.
- **Performance**: The server doesn't need to remember who is logged in (Stateless), making it faster and easier to scale.
