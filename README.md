# Rural Water Well Monitoring & Reporting System
Classification: Public-SLIIT



📌 1. Project Overview

The Rural Water Well Monitoring & Reporting System is a full-stack web application designed to manage and monitor rural water wells efficiently. It supports well management, condition reporting, lab testing, and repair tracking through a secure RESTful API.

### Main Modules

Frontend – user interface for admin, field officers, lab testers, and users  
API Server – centralized backend system  
Auth Module – registration, login, JWT authentication  
Well Management – create, update, delete, view wells  
Report Module – well condition reports  
Lab Report Module – water quality testing  
Repair Module – maintenance and repair tracking  



📌 2. Technology Stack

### Frontend
React.js  
Vite  
Tailwind CSS  

### Backend
Node.js  
Express.js  
JWT Authentication  
REST APIs  

### Database
MongoDB  

### Testing
Jest  
Supertest  
Artillery  
Vitest  
React Testing Library  



📌 3. Project Structure
```text
water-well-system/
│
├── frontend/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── performance/
│
└── README.md

```


📌 4. Prerequisites

Before running the project, install:

Node.js (v18+)
npm
MongoDB
Git

Verify installation:

node -v
npm -v

📌 5. Environment Configuration

Create .env file inside backend:

PORT=5000
MONGO_URI=mongodb://localhost:27017/waterwell_db
JWT_SECRET=your_secret_key

📌6. Setup Instructions
6.1 Clone Repository
git clone <your-repo-url>
cd water-well-system
6.2 Install Backend Dependencies
cd backend
npm install
6.3 Install Frontend Dependencies
cd ../frontend
npm install
6.4 Run Project

Backend:

cd backend
npm run dev

Frontend:

cd frontend
npm run dev
6.5 Access System

Frontend: http://localhost:5173

Backend: http://localhost:5000

📌7. API Endpoint Documentation
7.1 Authentication Rules

Protected endpoints require JWT token:

Authorization: Bearer <token>

7.2 Auth Module
| Method | Endpoint           | Auth | Description   |
| ------ | ------------------ | ---- | ------------- |
| POST   | `/api/auth/signup` | No   | Register user |
| POST   | `/api/auth/login`  | No   | Login user    |


7.3 Well Management
| Method | Endpoint                    | Auth        | Description        |
| ------ | --------------------------- | ----------- | ------------------ |
| POST   | `/api/wells`                | Yes (Admin) | Create well        |
| GET    | `/api/wells`                | Yes         | Get all wells      |
| GET    | `/api/wells/id/:id`         | Yes         | Get well by ID     |
| GET    | `/api/wells/wellId/:wellId` | Yes         | Get well by wellId |
| PUT    | `/api/wells/:id`            | Yes (Admin) | Update well        |
| PATCH  | `/api/wells/:id/status`     | Yes         | Update status      |
| DELETE | `/api/wells/:id`            | Yes (Admin) | Delete well        |

Example request:

{
  "wellId": "WELL-001",
  "name": "Village Well",
  "village": "Kandy",
  "lat": 7.29,
  "lng": 80.63,
  "depth": 30,
  "type": "Tube Well"
}
Example response
{
  "success": true,
  "message": "Well created successfully",
  "data": {
    "_id": "123",
    "wellId": "WELL-001",
    "name": "Village Well",
    "village": "Kandy",
    "depth": 30,
    "type": "Tube Well",
    "status": "Active"
  }
}

7.4 Reports
| Method | Endpoint                                     | Auth                       | Description                          |
| ------ | -------------------------------------------- | -------------------------- | ------------------------------------ |
| POST   | `/api/reports`                               | Yes                        | Create a new well condition report   |
| GET    | `/api/reports`                               | Yes                        | Get all reports                      |
| GET    | `/api/reports/well/:wellId`                  | Yes                        | Get reports for a specific well      |
| GET    | `/api/reports/:id`                           | Yes                        | Get a single report by ID            |
| PUT    | `/api/reports/:id`                           | Yes                        | Update a report                      |
| DELETE | `/api/reports/:id`                           | Yes                        | Delete a report                      |
| POST   | `/api/reports/:id/comments`                  | Yes                        | Add comment to a report              |
| GET    | `/api/reports/comments/all`                  | Yes                        | Get all comments from all reports    |
| GET    | `/api/reports/comments/well/:wellId`         | Yes                        | Get all comments for a specific well |
| PUT    | `/api/reports/:reportId/comments/:commentId` | Yes (Admin, Field Officer) | Update a comment                     |
| DELETE | `/api/reports/:reportId/comments/:commentId` | Yes (Admin, Field Officer) | Delete a comment                     |
Example request – create report

{
  "wellId": "WELL-001",
  "waterLevel": "Medium",
  "pumpStatus": "Working",
  "severity": "Warning",
  "description": "Pump is making unusual noise"
}

Example response

{
  "_id": "661111111111111111111111",
  "wellId": "WELL-001",
  "waterLevel": "Medium",
  "pumpStatus": "Working",
  "severity": "Warning",
  "description": "Pump is making unusual noise",
  "photos": [],
  "reportedBy": "660000000000000000000001"
}

7.5 Lab Reports
| Method | Endpoint                          | Auth | Description                          |
| ------ | --------------------------------- | ---- | ------------------------------------ |
| POST   | `/api/water-quality`              | Yes  | Add a new water quality test result  |
| GET    | `/api/water-quality`              | Yes  | Get all water quality test results   |
| GET    | `/api/water-quality/:id`          | Yes  | Get a single test result by ID       |
| GET    | `/api/water-quality/well/:wellId` | Yes  | Get test history for a specific well |
| PUT    | `/api/water-quality/:id`          | Yes  | Update a test result                 |
| DELETE | `/api/water-quality/:id`          | Yes  | Delete a test result                 |
Example request – add test result

{
  "wellId": "661111111111111111111111",
  "testerName": "Lab Officer A",
  "phLevel": 7.2,
  "turbidity": 2.5,
  "bacteriaCount": 0,
  "temperature": 28
}

Example response

{
  "_id": "662222222222222222222222",
  "wellId": "661111111111111111111111",
  "testerName": "Lab Officer A",
  "phLevel": 7.2,
  "turbidity": 2.5,
  "bacteriaCount": 0,
  "temperature": 28,
  "status": "Safe"
}

7.6 Maintenance Module
| Method | Endpoint               | Auth | Description                     |
| ------ | ---------------------- | ---- | ------------------------------- |
| POST   | `/api/maintenance`     | Yes  | Create a new maintenance record |
| GET    | `/api/maintenance`     | Yes  | Get all maintenance records     |
| GET    | `/api/maintenance/:id` | Yes  | Get maintenance record by ID    |
| PUT    | `/api/maintenance/:id` | Yes  | Update maintenance record       |
| DELETE | `/api/maintenance/:id` | Yes  | Delete maintenance record       |
Current placeholder response example

{
  "message": "Create maintenance - not yet implemented"
}



📌8. Deployment Report
8.1 Objective

To deploy a stable backend and frontend system with database connectivity.

### 8.2 Deployment Platforms

- Backend deployed using: Render
- Frontend deployed using: Vercel
- Database: MongoDB Atlas (cloud database)

---

### 8.3 Backend Deployment (Render)

Steps followed:

1. Created a new Web Service in Render
2. Connected GitHub repository
3. Selected backend folder as root directory
4. Configured build and start commands:

```bash
npm install
npm run start
```
---
Added environment variables:
MONGO_URI=<your_mongodb_atlas_uri>
JWT_SECRET=<your_secret_key>
PORT=5000

Deployed backend successfully

Backend URL:
https://your-backend-name.onrender.com
<img width="1919" height="1079" alt="Screenshot 2026-04-10 083733" src="https://github.com/user-attachments/assets/25b748ab-6a6f-4a8f-9c79-f11ab1481757" />

8.4 Frontend Deployment (Vercel)
Steps followed:

Imported project into Vercel
Selected frontend folder
Configured build settings:
npm install
npm run build

Added environment variable:
VITE_API_URL=https://your-backend-name.onrender.com
Deployed frontend successfully

Frontend URL :
https://your-frontend-name.vercel.app
<img width="1919" height="1079" alt="Screenshot 2026-04-10 102552" src="https://github.com/user-attachments/assets/efd0e40f-0a75-46f9-a387-ce15b1f62515" />

8.5 System Integration
Frontend communicates with backend via REST API
Axios is used to send HTTP requests
JWT token is stored in localStorage and sent in headers
API Base URL is configured using environment variables

8.6 Challenges
CORS issues
MongoDB connection errors
JWT authentication issues

8.7 Solutions
Enabled CORS middleware
Fixed environment variables
Verified token format



📌9. Testing Instruction Report
    
9.1 Testing Environment
Node.js
MongoDB
Jest
Supertest
Artillery

9.2 Unit Testing
npm test tests/unit

9.3 Integration Testing
npm test tests/integration

9.4 Performance Testing
npx artillery run tests/performance/loadtest.yml

9.5 Testing Checklist
Unit tests passed
API tested with integration tests
Performance tested under load
No major failures

📌10. Security Notes
Use JWT authentication
Do not expose .env files
Validate all inputs
Use role-based access control
