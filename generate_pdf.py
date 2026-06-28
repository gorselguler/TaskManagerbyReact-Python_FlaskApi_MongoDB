from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY

# ─── Color Palette (matching the app's Dusk/Warm themes) ───
INDIGO    = colors.HexColor("#6366f1")
PINK      = colors.HexColor("#ec4899")
AMBER     = colors.HexColor("#f59e0b")
RED       = colors.HexColor("#ef4444")
DARK_BG   = colors.HexColor("#0f172a")
CARD_BG   = colors.HexColor("#1e293b")
SLATE_400 = colors.HexColor("#94a3b8")
WHITE     = colors.white
BLACK     = colors.black

def styles():
    base = getSampleStyleSheet()
    custom = {
        'cover_title': ParagraphStyle('cover_title', fontName='Helvetica-Bold', fontSize=32, textColor=WHITE, spaceAfter=8, alignment=TA_CENTER),
        'cover_sub':   ParagraphStyle('cover_sub',   fontName='Helvetica',      fontSize=13, textColor=SLATE_400, spaceAfter=4, alignment=TA_CENTER),
        'cover_date':  ParagraphStyle('cover_date',  fontName='Helvetica',      fontSize=10, textColor=PINK,      spaceAfter=0, alignment=TA_CENTER),
        'section':     ParagraphStyle('section',     fontName='Helvetica-Bold', fontSize=16, textColor=INDIGO,    spaceBefore=20, spaceAfter=8),
        'subsection':  ParagraphStyle('subsection',  fontName='Helvetica-Bold', fontSize=12, textColor=PINK,      spaceBefore=12, spaceAfter=6),
        'body':        ParagraphStyle('body',        fontName='Helvetica',      fontSize=10, textColor=colors.HexColor("#334155"), leading=16, spaceAfter=6, alignment=TA_JUSTIFY),
        'code':        ParagraphStyle('code',        fontName='Courier',        fontSize=9,  textColor=colors.HexColor("#1e293b"), backColor=colors.HexColor("#f1f5f9"), leading=14, leftIndent=12, spaceAfter=8),
        'bullet':      ParagraphStyle('bullet',      fontName='Helvetica',      fontSize=10, textColor=colors.HexColor("#334155"), leading=16, leftIndent=16, spaceAfter=4),
        'label':       ParagraphStyle('label',       fontName='Helvetica-Bold', fontSize=10, textColor=AMBER,     spaceAfter=2),
        'toc_title':   ParagraphStyle('toc_title',   fontName='Helvetica-Bold', fontSize=14, textColor=DARK_BG,   spaceAfter=10),
        'toc_item':    ParagraphStyle('toc_item',    fontName='Helvetica',      fontSize=11, textColor=colors.HexColor("#475569"), leading=20),
    }
    return custom

def divider(story, color=INDIGO):
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1.5, color=color, spaceAfter=10))

def table(data, col_widths, header_color=INDIGO):
    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND',   (0, 0), (-1,  0), header_color),
        ('TEXTCOLOR',    (0, 0), (-1,  0), WHITE),
        ('FONTNAME',     (0, 0), (-1,  0), 'Helvetica-Bold'),
        ('FONTSIZE',     (0, 0), (-1,  0), 10),
        ('ALIGN',        (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN',       (0, 0), (-1, -1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#f8fafc"), WHITE]),
        ('FONTNAME',     (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE',     (0, 1), (-1, -1), 9),
        ('GRID',         (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING',   (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING',(0, 0), (-1, -1), 8),
        ('LEFTPADDING',  (0, 0), (-1, -1), 10),
    ]))
    return t

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename, pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm,
        topMargin=2*cm, bottomMargin=2*cm
    )
    s = styles()
    story = []
    W = A4[0] - 4*cm  # usable width

    # ══════════════════════════════════════════════════
    # COVER PAGE
    # ══════════════════════════════════════════════════
    cover_bg = Table(
        [[Paragraph("Task Manager", s['cover_title']),
          Paragraph("Full-Stack Application Report", s['cover_sub']),
          Paragraph("React 19  ·  Flask  ·  MongoDB  ·  Tailwind CSS v4", s['cover_sub']),
          Spacer(1, 8),
          Paragraph("May 2026", s['cover_date'])]],
        colWidths=[W]
    )
    cover_bg.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), DARK_BG),
        ('TOPPADDING',    (0,0),(-1,-1), 60),
        ('BOTTOMPADDING', (0,0),(-1,-1), 60),
        ('LEFTPADDING',   (0,0),(-1,-1), 30),
        ('RIGHTPADDING',  (0,0),(-1,-1), 30),
        ('ROUNDEDCORNERS',(0,0),(-1,-1), [12,12,12,12]),
    ]))
    story.append(cover_bg)
    story.append(Spacer(1, 24))
    story.append(Paragraph(
        "A complete professional reference guide covering architecture, "
        "authentication, database design, UI components, API endpoints, "
        "security model and design system decisions.",
        s['body']
    ))
    story.append(PageBreak())

    # ══════════════════════════════════════════════════
    # TABLE OF CONTENTS
    # ══════════════════════════════════════════════════
    story.append(Paragraph("Table of Contents", s['toc_title']))
    divider(story, AMBER)
    toc_items = [
        "1.  Project Overview",
        "2.  Technology Stack & Dependencies",
        "3.  Project Folder Structure",
        "4.  Frontend Architecture (React)",
        "5.  Backend Architecture (Flask)",
        "6.  Database Design (MongoDB)",
        "7.  Authentication & Security (JWT)",
        "8.  API Endpoint Reference",
        "9.  Design System & Tailwind Theme",
        "10. Data Flow — End to End",
        "11. Planned Features",
    ]
    for item in toc_items:
        story.append(Paragraph(item, s['toc_item']))
    story.append(PageBreak())

    # ══════════════════════════════════════════════════
    # 1. PROJECT OVERVIEW
    # ══════════════════════════════════════════════════
    story.append(Paragraph("1. Project Overview", s['section']))
    divider(story)
    story.append(Paragraph(
        "Task Manager is a professional full-stack web application that allows authenticated users "
        "to create, manage, and track their personal tasks. It features a dark-themed, "
        "gradient-driven dashboard with a modular component structure built entirely in React. "
        "The backend is a RESTful API built with Python Flask that communicates with a MongoDB "
        "NoSQL database. All user data is isolated by account using JWT-based authentication.",
        s['body']
    ))
    story.append(Spacer(1, 8))
    story.append(Paragraph("Key Characteristics:", s['label']))
    for item in [
        "Single Page Application (SPA) — no full page reloads.",
        "Stateless backend — the server does not store sessions, all identity is in the JWT token.",
        "User-isolated data — each user can only access their own tasks in MongoDB.",
        "Persistent login — token stored in localStorage survives browser refresh.",
        "Dark professional UI with custom Tailwind v4 theme variables.",
    ]:
        story.append(Paragraph(f"  •  {item}", s['bullet']))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════
    # 2. TECH STACK
    # ══════════════════════════════════════════════════
    story.append(Paragraph("2. Technology Stack & Dependencies", s['section']))
    divider(story)

    story.append(Paragraph("Frontend (react/frontend/package.json)", s['subsection']))
    story.append(table(
        [['Package', 'Version', 'Purpose'],
         ['react', '^19.2.5', 'Core UI library'],
         ['react-dom', '^19.2.5', 'DOM rendering for React'],
         ['vite', '^6.x', 'Build tool and dev server'],
         ['tailwindcss', '^4.2.4', 'Utility-first CSS framework'],
         ['@tailwindcss/vite', '^4.2.4', 'Tailwind v4 Vite plugin integration']],
        [4.5*cm, 3.5*cm, 7.5*cm]
    ))
    story.append(Spacer(1, 12))

    story.append(Paragraph("Backend (backend/requirements.txt)", s['subsection']))
    story.append(table(
        [['Package', 'Purpose'],
         ['flask', 'Web framework — handles HTTP routes and responses'],
         ['flask-cors', 'Allows React (port 5173) to talk to Flask (port 5000)'],
         ['pymongo', 'Official MongoDB driver for Python'],
         ['python-dotenv', 'Loads secrets from a .env file safely'],
         ['bcrypt', 'Password hashing — never stores plain text passwords'],
         ['PyJWT', 'Creates and verifies JSON Web Tokens'],
         ['reportlab', 'PDF generation (used for this report)']],
        [4.5*cm, 11*cm], header_color=AMBER
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════
    # 3. FOLDER STRUCTURE
    # ══════════════════════════════════════════════════
    story.append(Paragraph("3. Project Folder Structure", s['section']))
    divider(story)
    structure = """
project-root/
├── backend/
│   ├── app/
│   │   ├── __init__.py      ← Flask app factory, registers Blueprints & CORS
│   │   ├── models.py        ← MongoDB client, db, tasks + users collections
│   │   └── routes.py        ← All API routes: Auth (/login, /register) + Tasks
│   ├── requirements.txt     ← Python package list
│   └── run.py               ← Entry point: starts Flask on port 5000
│
├── react/frontend/
│   ├── src/
│   │   ├── App.jsx          ← Main layout: TopBar + Sidebar + Dashboard
│   │   ├── index.css        ← Tailwind import + custom @theme variables
│   │   └── components/
│   │       ├── TopBar.jsx   ← Header: logo, auth modal, user profile
│   │       └── LeftSideBar.jsx ← Navigation: Dashboard, Notes, Gallery...
│   ├── index.html           ← HTML entry point (mounts React root)
│   └── package.json         ← Node dependencies and scripts
│
├── generate_pdf.py          ← Script that generates this PDF report
├── DOCUMENTATION.md         ← Human-readable project docs
├── AUTH_REPORT.md           ← Detailed authentication explanation
└── README.md                ← Project overview with dashboard preview
"""
    story.append(Paragraph(structure.replace('\n', '<br/>').replace(' ', '&nbsp;'), s['code']))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════
    # 4. FRONTEND ARCHITECTURE
    # ══════════════════════════════════════════════════
    story.append(Paragraph("4. Frontend Architecture (React)", s['section']))
    divider(story)

    story.append(Paragraph("App.jsx — The Layout Orchestrator", s['subsection']))
    story.append(Paragraph(
        "App.jsx is the root component that controls the entire page layout. "
        "It uses a Flexbox column structure: TopBar on top, then a row containing "
        "LeftSidebar and the main content area side by side. The key CSS principle is "
        "h-screen + overflow-hidden on the wrapper, and overflow-y-auto only on the "
        "main content — this creates a true app-like experience where the sidebar and "
        "header never scroll.", s['body']
    ))
    story.append(Paragraph("Key React concepts used:", s['label']))
    for item in [
        "useState — tracks tasks, newTaskTitle, newTaskDate, isAdding, and user state.",
        "useEffect — runs fetchTasks() once on page load to populate the dashboard.",
        "fetch() — used for all HTTP calls (GET, POST, DELETE) to the Flask backend.",
        "Conditional rendering — shows Auth component if no user is logged in.",
        "Array methods — .filter() removes a task client-side after successful DELETE.",
    ]:
        story.append(Paragraph(f"  •  {item}", s['bullet']))
    story.append(Spacer(1, 8))

    story.append(Paragraph("TopBar.jsx — Identity & Auth Modal", s['subsection']))
    story.append(Paragraph(
        "TopBar manages the entire authentication UI. It maintains 5 state variables: "
        "isLoggedIn, userData, showModal, isRegister, and formData. On mount, useEffect "
        "checks localStorage for a saved token and user — if found, the user is "
        "automatically logged back in. The modal toggles between Login and Register "
        "modes with a single boolean state (isRegister).", s['body']
    ))

    story.append(Paragraph("LeftSideBar.jsx — Navigation", s['subsection']))
    story.append(Paragraph(
        "A static navigation component that renders 5 menu items using .map(). "
        "The active item (Dashboard) is highlighted using a conditional Tailwind class "
        "that applies a dusk gradient background. Other items show a warm gradient "
        "vertical bar on hover using CSS opacity transitions.", s['body']
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════
    # 5. BACKEND ARCHITECTURE
    # ══════════════════════════════════════════════════
    story.append(Paragraph("5. Backend Architecture (Flask)", s['section']))
    divider(story)

    story.append(Paragraph("__init__.py — App Factory", s['subsection']))
    story.append(Paragraph(
        "Uses the Flask Application Factory pattern. create_app() initializes the "
        "Flask app, applies CORS (which allows requests from the React dev server on "
        "port 5173), and registers both Blueprints: tasks_bp and auth_bp.", s['body']
    ))
    story.append(Paragraph(
        "from .routes import tasks_bp, auth_bp\n"
        "app.register_blueprint(tasks_bp)\n"
        "app.register_blueprint(auth_bp)", s['code']
    ))

    story.append(Paragraph("models.py — Database Connection", s['subsection']))
    story.append(Paragraph(
        "Connects to MongoDB using the URI from a .env file. Defines two collection "
        "variables — tasks_collection and users_collection — that are imported directly "
        "into routes.py and used for all database operations.", s['body']
    ))

    story.append(Paragraph("routes.py — All Business Logic", s['subsection']))
    story.append(Paragraph(
        "The core of the backend. Divided into two sections: Auth Routes (public) "
        "and Task Routes (protected). The file imports bcrypt, jwt, datetime, os "
        "and ObjectId from bson for all operations.", s['body']
    ))

    story.append(Paragraph("token_required Decorator:", s['label']))
    story.append(Paragraph(
        "def token_required(f):\n"
        "    def decorated(*args, **kwargs):\n"
        "        token = request.headers.get('Authorization')\n"
        "        if not token: return error 401\n"
        "        data = jwt.decode(token, SECRET_KEY)\n"
        "        current_user = users_collection.find_one({'_id': ObjectId(data['user_id'])})\n"
        "        return f(current_user, *args, **kwargs)", s['code']
    ))
    story.append(Paragraph(
        "This decorator is applied with @token_required on every task route. "
        "It intercepts the request, reads the Authorization header, decodes the JWT "
        "to extract the user_id, fetches the user from MongoDB, and passes them as "
        "the first argument (current_user) into the protected function.", s['body']
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════
    # 6. DATABASE DESIGN
    # ══════════════════════════════════════════════════
    story.append(Paragraph("6. Database Design (MongoDB)", s['section']))
    divider(story)
    story.append(Paragraph(
        "MongoDB is a NoSQL document database. Data is stored as JSON-like "
        "documents inside collections (equivalent to SQL tables). "
        "The database name is 'taskmanager' and contains two collections.", s['body']
    ))

    story.append(Paragraph("users Collection", s['subsection']))
    story.append(table(
        [['Field', 'Type', 'Description'],
         ['_id', 'ObjectId', 'Auto-generated unique identifier by MongoDB'],
         ['email', 'String', 'User email address (must be unique)'],
         ['password', 'Binary', 'Bcrypt-hashed password (never plain text)'],
         ['name', 'String', 'Display name shown in the TopBar'],
         ['created_at', 'DateTime', 'UTC timestamp of registration']],
        [3*cm, 3*cm, 9.5*cm]
    ))
    story.append(Spacer(1, 12))

    story.append(Paragraph("tasks Collection", s['subsection']))
    story.append(table(
        [['Field', 'Type', 'Description'],
         ['_id', 'ObjectId', 'Auto-generated unique identifier by MongoDB'],
         ['title', 'String', 'The task description text'],
         ['done', 'Boolean', 'Completion status — False by default'],
         ['date', 'String', 'Optional due date set by the user'],
         ['user_id', 'String', 'Links the task to its owner (from users._id)']],
        [3*cm, 3*cm, 9.5*cm], header_color=AMBER
    ))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "The user_id field is the key to data isolation. When fetching tasks, "
        "the query is: tasks_collection.find({'user_id': str(current_user['_id'])}) "
        "— this ensures each user only ever receives their own data.", s['body']
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════
    # 7. AUTHENTICATION & SECURITY
    # ══════════════════════════════════════════════════
    story.append(Paragraph("7. Authentication & Security (JWT)", s['section']))
    divider(story)

    story.append(Paragraph("Step 1 — Registration", s['subsection']))
    for step in [
        "React sends { name, email, password } as JSON to POST /register.",
        "Flask checks if the email already exists in users_collection.",
        "If new, bcrypt.hashpw() converts the plain password into a secure hash.",
        "The hash (not the original password) is stored in MongoDB.",
        "A 201 Created response is returned — user is told to log in.",
    ]:
        story.append(Paragraph(f"  {step}", s['bullet']))

    story.append(Paragraph("Step 2 — Login", s['subsection']))
    for step in [
        "React sends { email, password } to POST /login.",
        "Flask finds the user by email in users_collection.",
        "bcrypt.checkpw() compares the input password against the stored hash.",
        "If they match, jwt.encode() creates a token containing { user_id, exp }.",
        "The token + user info is returned to React.",
        "React stores token in localStorage.setItem('token', ...) for persistence.",
    ]:
        story.append(Paragraph(f"  {step}", s['bullet']))

    story.append(Paragraph("Step 3 — Authenticated Requests", s['subsection']))
    for step in [
        "React reads the token from localStorage.",
        "Sends it in every request header: Authorization: Bearer <token>.",
        "@token_required intercepts the request and decodes the token.",
        "If valid, current_user is extracted and passed to the route function.",
        "If expired or invalid, a 401 Unauthorized response is returned.",
    ]:
        story.append(Paragraph(f"  {step}", s['bullet']))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Security Notes:", s['label']))
    for note in [
        "Passwords are NEVER stored or compared as plain text — bcrypt is used.",
        "JWT tokens expire after 24 hours (timedelta(hours=24)).",
        "The SECRET_KEY is loaded from a .env file — never hardcoded in production.",
        "Each task query filters by user_id — cross-user data access is impossible.",
        "CORS is configured to accept requests from the frontend origin only.",
    ]:
        story.append(Paragraph(f"  •  {note}", s['bullet']))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════
    # 8. API ENDPOINT REFERENCE
    # ══════════════════════════════════════════════════
    story.append(Paragraph("8. API Endpoint Reference", s['section']))
    divider(story)

    story.append(Paragraph("Public Endpoints (No Token Required)", s['subsection']))
    story.append(table(
        [['Method', 'Endpoint', 'Body (JSON)', 'Response'],
         ['POST', '/register', '{ name, email, password }', '201 — { message, id }'],
         ['POST', '/login', '{ email, password }', '200 — { token, user }']],
        [2*cm, 3.5*cm, 5.5*cm, 4.5*cm]
    ))
    story.append(Spacer(1, 12))

    story.append(Paragraph("Protected Endpoints (JWT Token Required in Header)", s['subsection']))
    story.append(table(
        [['Method', 'Endpoint', 'Body (JSON)', 'Response'],
         ['GET',    '/tasks',       'None',                  '200 — [ list of tasks ]'],
         ['POST',   '/tasks',       '{ title, date }',       '201 — { new task object }'],
         ['PUT',    '/tasks/<id>',  '{ done, title, ... }',  '200 — { updated task }'],
         ['DELETE', '/tasks/<id>',  'None',                  '200 — { message: Deleted }']],
        [2*cm, 3.5*cm, 4.5*cm, 5.5*cm], header_color=AMBER
    ))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Header format for protected requests:   Authorization: Bearer eyJhbGciOiJIUzI1...",
        s['code']
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════
    # 9. DESIGN SYSTEM
    # ══════════════════════════════════════════════════
    story.append(Paragraph("9. Design System & Tailwind Theme", s['section']))
    divider(story)
    story.append(Paragraph(
        "The application uses Tailwind CSS v4, which allows defining custom design "
        "tokens using the @theme block in index.css. These variables become available "
        "as Tailwind utility classes throughout the entire codebase.", s['body']
    ))
    story.append(table(
        [['Variable', 'Hex Value', 'Usage'],
         ['--color-dusk-start', '#6366f1 (Indigo)', 'Gradient start — notes card, topbar logo'],
         ['--color-dusk-end',   '#ec4899 (Pink)',   'Gradient end — active nav item, logout text'],
         ['--color-warm-start', '#f59e0b (Amber)',  'Gradient start — documents card, avatar ring'],
         ['--color-warm-end',   '#ef4444 (Red)',    'Gradient end — hover accents'],
         ['--color-dashboard-bg','#0f172a (Slate 900)', 'Main page background, sidebar'],
         ['--color-card-bg',    '#1e293b (Slate 800)', 'Card backgrounds, topbar background']],
        [4.5*cm, 4.5*cm, 6.5*cm]
    ))
    story.append(Spacer(1, 8))
    story.append(Paragraph("Usage in JSX:", s['label']))
    story.append(Paragraph(
        "bg-gradient-to-r from-dusk-start to-dusk-end\n"
        "text-dusk-end\n"
        "bg-dashboard-bg\n"
        "bg-card-bg", s['code']
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════
    # 10. DATA FLOW
    # ══════════════════════════════════════════════════
    story.append(Paragraph("10. Data Flow — End to End", s['section']))
    divider(story)
    story.append(table(
        [['Step', 'Actor', 'Action'],
         ['1',  'Browser',   'User opens http://localhost:5173'],
         ['2',  'React',     'App.jsx checks localStorage for token'],
         ['3',  'React',     'If no token → shows Auth modal (TopBar)'],
         ['4',  'User',      'Enters email + password, submits form'],
         ['5',  'React',     'fetch() POST to http://localhost:5000/login'],
         ['6',  'Flask',     'Checks email in MongoDB users collection'],
         ['7',  'Flask',     'bcrypt.checkpw() verifies the password hash'],
         ['8',  'Flask',     'jwt.encode() creates a 24h token, returns it'],
         ['9',  'React',     'Saves token + user to localStorage'],
         ['10', 'React',     'Updates state: isLoggedIn=true, shows user name'],
         ['11', 'React',     'useEffect calls fetchTasks() with Bearer token'],
         ['12', 'Flask',     '@token_required validates token, finds user'],
         ['13', 'MongoDB',   'Returns tasks where user_id matches current user'],
         ['14', 'React',     'setTasks(data) — dashboard renders task list']],
        [1.5*cm, 3*cm, 11*cm]
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════
    # 11. PLANNED FEATURES
    # ══════════════════════════════════════════════════
    story.append(Paragraph("11. Planned Features", s['section']))
    divider(story, AMBER)
    story.append(table(
        [['Feature', 'Description', 'Status'],
         ['Notes Module',       'Create, read, update, delete personal notes', 'Planned'],
         ['Gallery Module',     'Upload and display images per user account',  'Planned'],
         ['Calculator Widget',  'In-dashboard calculator component',           'Planned'],
         ['Documents Section',  'Upload and manage PDF/DOC files',             'Planned'],
         ['Task Priority',      'Mark tasks as High / Medium / Low',           'Planned'],
         ['Due Date Alerts',    'Notify when a task deadline is approaching',  'Planned'],
         ['Task Categories',    'Group tasks by Work, Personal, School etc.',  'Planned'],
         ['Profile Settings',   'Update name, email, avatar, password',        'Planned']],
        [4.5*cm, 7*cm, 2.5*cm], header_color=AMBER
    ))

    # Build
    doc.build(story)
    print("✓  Project_Documentation.pdf created successfully.")

if __name__ == "__main__":
    build_pdf("Project_Documentation.pdf")
