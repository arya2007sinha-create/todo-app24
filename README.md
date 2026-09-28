# TaskFlow - Modern To-Do Management System

A production-grade, full-stack SaaS-quality Task Management application. Built with a clean architecture, emphasizing security, performance, and a premium user experience.

## Features
- **User Authentication**: Secure JWT-based auth with bcrypt password hashing.
- **Task Management**: Create, Read, Update, and Delete tasks with detailed metadata (Priority, Category, Due Dates, Estimated Time).
- **Smart Dashboard**: A "Today" view showing overdue tasks, tasks due today, and dynamic productivity insights based on user habits.
- **Advanced Filtering & Search**: Real-time search by title/description, and combinations of status, priority, and date sorting.
- **Analytics**: Visual charts built with Recharts showing completion history and priority distribution.
- **Responsive UI**: Fully responsive Tailwind CSS layout tailored for mobile and desktop.
- **Data Security**: Strict backend ownership validation ensures users cannot access cross-tenant data.

## Technology Stack
**Frontend:** React.js, Vite, React Router, Axios, Tailwind CSS, Recharts, Lucide-React.
**Backend:** Node.js, Express.js.
**Database:** Supabase (PostgreSQL).

## Folder Structure
```
todo-app/
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/       # Reusable UI elements (TaskCard, TaskModal)
│   │   ├── context/          # Global Auth State
│   │   ├── hooks/            # Custom hooks (useTasks)
│   │   ├── layouts/          # Auth & Dashboard Layouts
│   │   ├── pages/            # Page components
│   │   └── services/         # Axios API Client
│   └── package.json
│
└── backend/                  # Node.js API
    ├── config/               # Supabase & DB connection
    ├── controllers/          # Business Logic
    ├── middleware/           # Auth & Error Handling
    ├── models/               # DB Queries & Data layer
    ├── routes/               # API Endpoints
    ├── services/             # Analytics aggregations
    ├── app.js                # Express App Setup
    └── server.js             # HTTP Server Entry
```

## Setup & Installation

### 1. Database Setup (Supabase)
1. Create a project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** and run the scripts provided in the `supabase_schema.md` artifact (created previously). This sets up all tables and relationships.

### 2. Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=your_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=super_secret_jwt_key_here
```

Create a `.env` file in the `frontend/` directory (if different from default):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Running the Backend
```bash
cd backend
npm install
npm run dev
```

### 4. Running the Frontend
```bash
cd frontend
npm install
npm run dev
```

## Security Notes
- Passwords are never stored in plain text (bcrypt).
- Backend validates all JWTs via custom middleware.
- Database access is strictly scoped `WHERE user_id = req.user.id`.
- Helmet is used for HTTP headers protection.

## Future Improvements
- Implement drag-and-drop Kanban view.
- Add user-uploaded avatars via Supabase Storage.
- Integrate email notifications for overdue tasks.
