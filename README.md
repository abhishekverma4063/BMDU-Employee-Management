# BMDU Employee Management System

A full-stack **MERN** (MongoDB, Express, React, Node.js) Employee Management System built with professional enterprise-level architecture.

## 🚀 Tech Stack

| Layer    | Technology               |
|----------|--------------------------|
| Frontend | React.js (Vite), Tailwind CSS, React Router, Axios, Lucide React |
| Backend  | Node.js, Express.js      |
| Database | MongoDB + Mongoose       |

---

## 📁 Project Structure

```
BMDU/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   └── employeeController.js # CRUD logic
│   ├── middleware/
│   │   └── errorMiddleware.js    # Global error handler
│   ├── models/
│   │   └── Employee.js           # Mongoose schema
│   ├── routes/
│   │   └── employeeRoutes.js     # API routes
│   ├── server.js                 # Express app entry
│   ├── .env                      # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── employees/
    │   │   │   ├── EmployeeForm.jsx
    │   │   │   ├── EmployeeTable.jsx
    │   │   │   └── EmployeeDetails.jsx
    │   │   ├── layout/
    │   │   │   ├── Sidebar.jsx
    │   │   │   └── Topbar.jsx
    │   │   └── ui/
    │   │       ├── Toast.jsx
    │   │       ├── ConfirmDialog.jsx
    │   │       ├── LoadingSpinner.jsx
    │   │       └── StatusBadge.jsx
    │   ├── layouts/
    │   │   └── MainLayout.jsx
    │   ├── pages/
    │   │   ├── DashboardPage.jsx
    │   │   ├── EmployeesPage.jsx
    │   │   └── AddEmployeePage.jsx
    │   ├── services/
    │   │   ├── axiosInstance.js
    │   │   └── employeeService.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

## ⚙️ Prerequisites

- **Node.js** v18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** v9+

---

## 🛠️ Installation & Setup

### 1. Clone or navigate to the project

```bash
cd BMDU
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create the `.env` file (or copy from `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bmdu_employees
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

The API will be running at: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

The app will be running at: `http://localhost:3000`

---

## 📡 API Documentation

Base URL: `http://localhost:5000/api`

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/employees` | Get all employees (supports search & filters) |
| POST | `/employees` | Create a new employee |
| GET | `/employees/stats/overview` | Get dashboard statistics |
| GET | `/employees/:id` | Get one employee by ID |
| PUT | `/employees/:id` | Update employee |
| DELETE | `/employees/:id` | Delete employee |

### Query Parameters (GET /employees)

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search by name or email |
| `department` | string | Filter by department |
| `status` | string | Filter by Active/Inactive |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 50) |

### Employee Schema

```json
{
  "employeeName": "string (required)",
  "email": "string (required, unique)",
  "phoneNumber": "string (required)",
  "department": "string (required, enum)",
  "designation": "string (required)",
  "joiningDate": "date (required)",
  "status": "Active | Inactive (default: Active)"
}
```

### Valid Departments

- Engineering
- Human Resources
- Finance
- Marketing
- Sales
- Operations
- Product
- Design
- Legal
- Customer Support

### Response Format

```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

---

## ✅ Features

- ✅ Dashboard with live statistics (Total, Active, Inactive employees + departments)
- ✅ Department breakdown with visual progress bars
- ✅ Full CRUD: Create, Read, Update, Delete employees
- ✅ Search employees by name or email
- ✅ Filter by department and status
- ✅ Auto-generated Employee IDs (BMDU-0001, BMDU-0002...)
- ✅ Form validation (frontend + backend)
- ✅ Duplicate email prevention
- ✅ Confirmation dialog before delete
- ✅ Toast notifications for all actions
- ✅ Loading and empty states
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Professional dark navy sidebar
- ✅ Clean MVC architecture

---

## 🧪 Testing the Application

1. **Add employee** — Click "Add Employee", fill the form, submit
2. **View employees** — Navigate to "Employees" in sidebar
3. **Search** — Type in the search box to filter by name/email
4. **Filter by department** — Use the department dropdown
5. **Filter by status** — Click Active/Inactive/All buttons
6. **View details** — Click the eye icon on any row
7. **Edit** — Click the pencil icon, update fields, save
8. **Delete** — Click trash icon, confirm in dialog
9. **Duplicate email** — Try adding an employee with an existing email — blocked ✅
10. **Validation** — Submit empty form — all required fields highlighted ✅

---

## 🌐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/bmdu_employees` |
| `NODE_ENV` | Environment | `development` |

---

## 📄 License

MIT — Built as a MERN technical assessment project for BMDU.
