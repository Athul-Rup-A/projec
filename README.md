# projec
# Task Manager App

A full-stack task management web application built using the **MERN stack** (MongoDB, Express.js, React, Node.js). This app enables users to sign up, log in, manage tasks with priority and due dates, and track task completion via a simple dashboard.

## 🌟 Features

- User authentication (Sign Up / Login)
- Dashboard with task list view
- Task creation with:
  - Title, Description
  - Priority (High/Medium/Low)
  - Due Date
  - Completion Status
- User profile page
  - Edit profile details
  - View task statistics (total, completed, overdue)
- Responsive design using Bootstrap

## 🚀 Tech Stack

**Frontend**
- React (with Vite)
- React Router
- Axios
- Bootstrap

**Backend**
- Node.js
- Express.js
- MongoDB (via Mongoose)
- JWT for Authentication

---

## 🛠️ Getting Started

Follow these steps to set up and run the project on your local machine:

```bash
# 1. Clone the repository and move into the project directory
git clone https://github.com/Athul-Rup-A/projec.git
cd projec

# 2. Install frontend dependencies
cd client
npm install

# 3. Install backend dependencies
cd ../server
npm install

# 4. Configure environment variables
Create a .env file in the server/ folder with the following:
PORT=3700
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# 5. Start the backend server
npm start

# 6. Start the frontend development server
cd ../client
npm run dev

# 7. Open your browser and go to:
http://localhost:5173

