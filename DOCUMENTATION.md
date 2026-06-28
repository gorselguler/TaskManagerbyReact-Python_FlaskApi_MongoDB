# Project Documentation

## 🚀 Overview
This project is a modern **Task Management Application** built with a professional dark-themed UI. It features a complete authentication system and a persistent database.

---

## 🛠️ Technology Stack
- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Custom Dusk & Warm Sand themes)
- **Backend**: [Python Flask](https://flask.palletsprojects.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Security**: [JWT](https://jwt.io/) (JSON Web Tokens) & [bcrypt](https://pypi.org/project/bcrypt/)

---

## 📂 Architecture

### Backend (`/backend`)
- `run.py`: Entry point for the Flask server.
- `app/__init__.py`: App factory where CORS and Blueprints are registered.
- `app/models.py`: Database connection setup for MongoDB.
- `app/routes.py`: Contains both Authentication logic and Task management logic (protected by JWT).

### Frontend (`/react/frontend`)
- `src/App.jsx`: Main layout using a "Sidebar + Main" architecture.
- `src/components/TopBar.jsx`: Handles user identity and Authentication Modals.
- `src/components/LeftSideBar.jsx`: Navigation menu with custom gradient hover effects.
- `src/index.css`: Defines the global **Tailwind v4 @theme** variables.

---

## 🔐 Authentication Flow
1. **Register**: User data is saved with a hashed password in MongoDB.
2. **Login**: Server verifies credentials and returns a JWT (expires in 24h).
3. **Session**: The token is stored in the browser's `localStorage`.
4. **Authorized Requests**: Every task-related request sends the token in the `Authorization` header.

---

## 🎨 Global Theme (Tailwind v4)
We use a custom dark theme defined in `src/index.css`:
- **Dashboard BG**: Deep Slate (`#020617`)
- **Card BG**: Dark Navy (`#0f172a / 40% opacity`)
- **Dusk Gradient**: Indigo to Pink (`#6366f1` -> `#ec4899`)
- **Warm Sand Gradient**: Amber to Red (`#f59e0b` -> `#ef4444`)

---

## 📡 API Endpoints

### Auth
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/register` | POST | Create a new user account |
| `/login` | POST | Auth user and get JWT token |

### Tasks (Requires Token)
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/tasks` | GET | Retrieve user-specific tasks |
| `/tasks` | POST | Create a new task |
| `/tasks/<id>` | PUT | Toggle task status |
| `/tasks/<id>` | DELETE | Remove a task |
