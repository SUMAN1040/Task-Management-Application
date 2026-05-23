# TaskPro - MERN Stack Task Management App

TaskPro is a full-stack, production-ready Task Management Application built using the MERN stack (MongoDB, Express.js, React, Node.js). It features a beautiful, responsive user interface styled with Tailwind CSS, secure JWT authentication, and comprehensive task organization tools.

## 🚀 Features

### Authentication & Security
- Complete User Registration and Login flows
- Secure password hashing using `bcryptjs`
- JWT (JSON Web Token) based authentication
- Protected routes preventing unauthorized access

### Task Management
- **CRUD Operations**: Create, Read, Update, and Delete tasks.
- **Task Attributes**: Tasks include Title, Description, Priority (Low/Medium/High), Status (Pending/In-Progress/Completed), and Due Dates.
- **Advanced Filtering**: Filter tasks instantly by their Status or Priority.
- **Search**: Real-time search functionality across task titles and descriptions.
- **Pagination**: Efficiently loads tasks in pages to ensure fast performance.

### UI/UX Enhancements
- **Premium Design**: Built with Tailwind CSS using modern glassmorphism UI elements.
- **Dark Mode**: Intelligent Dark/Light mode support with a user toggle and system preference detection.
- **Responsive Layout**: Completely mobile-friendly design (List vs Grid views).
- **Toast Notifications**: Interactive success and error feedback for user actions.
- **Form Validation**: Client-side validation using `react-hook-form` and `yup`.

## 💻 Tech Stack

**Frontend:**
- React 18 (Vite)
- Tailwind CSS
- React Router DOM
- React Context API (State Management)
- Axios (API Requests)
- React Hook Form & Yup (Validation)
- Lucide React (Icons)
- React Hot Toast (Notifications)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- bcryptjs

## 🛠️ Installation & Setup

### Prerequisites
Make sure you have Node.js installed and a MongoDB Database (local or MongoDB Atlas cluster).

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Task-Management-Application
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and configure your environment variables.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory with the following variables:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```
*(Remember to URL-encode any special characters in your MongoDB password, e.g., `@` becomes `%40`)*

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies.

```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Open the App
The application will automatically proxy API requests to the backend. Open your browser and navigate to:
**`http://localhost:3000`**

## 📂 Folder Structure

```
Task-Management-Application/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route logic (auth, tasks)
│   │   ├── middleware/      # Auth & Error handling middlewares
│   │   ├── models/          # Mongoose schemas (User, Task)
│   │   ├── routes/          # Express API routes
│   │   └── server.js        # Entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI elements (Layout, TaskCard, TaskModal)
    │   ├── context/         # React Context (AuthContext, TaskContext)
    │   ├── pages/           # Main views (Dashboard, Login, Register)
    │   ├── services/        # Axios API configurations
    │   ├── App.jsx          # Routing configuration
    │   ├── main.jsx         # Entry point
    │   └── index.css        # Tailwind directives and custom components
    ├── tailwind.config.js   # Tailwind theme settings
    └── package.json
```

## 🔌 API Endpoints Summary

**Auth Routes:**
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & get token
- `POST /api/auth/logout` - Logout user

**Task Routes (Requires JWT):**
- `GET /api/tasks` - Get all tasks (Supports `?search=`, `?status=`, `?priority=`, `?page=`, `?limit=`)
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a specific task
- `DELETE /api/tasks/:id` - Delete a specific task

---
*Developed with the MERN stack.*
