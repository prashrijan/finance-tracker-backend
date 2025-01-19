# Finance Tracker App - Backend

## Overview

The **Finance Tracker App** backend is the core of the application, responsible for handling user authentication, transaction management, and data processing. Built using **Node.js** and **Express.js**, it interacts with a **MongoDB** database to store and retrieve user and transaction data.

---

## Features

### User Authentication

- Secure account creation and login.
- Passwords hashed using **bcrypt**.
- JWT-based authentication for secure session management.

### Income and Expense Tracking

- APIs to add, edit, and delete transactions.
- Transactions categorized as income or expense with descriptions, dates, and amounts.

### Balance Calculation

- Automatic computation of current balance based on income and expenses.

---

## Technology Stack

### Backend

- **Node.js** with Express.js for API handling.
- **Database:** MongoDB (hosted on MongoDB Atlas).
- **Authentication:** JWT (JSON Web Tokens).

### Deployment

- Backend deployed on platforms like Render or Cyclic.

---

## Database Design

### Users Collection

| Field       | Type     | Description           |
| ----------- | -------- | --------------------- |
| `_id`       | ObjectId | Unique identifier     |
| `username`  | String   | User's name           |
| `email`     | String   | Unique email address  |
| `password`  | String   | Hashed password       |
| `createdAt` | Date     | Account creation date |

### Transactions Collection

| Field         | Type     | Description                          |
| ------------- | -------- | ------------------------------------ |
| `_id`         | ObjectId | Unique identifier                    |
| `userId`      | ObjectId | Reference to the Users collection    |
| `type`        | String   | Income or Expense                    |
| `amount`      | Number   | Transaction amount                   |
| `date`        | Date     | Transaction date                     |
| `description` | String   | Brief description of the transaction |
| `createdAt`   | Date     | Transaction creation date            |

---

## Security Considerations

- Passwords hashed using **bcrypt** before storage.
- Authentication implemented using **JWT** with secure cookie storage.
- **HTTPS** enforced on all deployments.

---

## File Structure

```
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── transactionController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   └── Transaction.js
├── routes/
│   ├── authRoutes.js
│   └── transactionRoutes.js
├── utils/
│   └── jwtUtils.js
├── .env
├── server.js
├── package.json
└── README.md
```

---

## How to Run Locally

### Prerequisites

- Node.js and npm installed.
- MongoDB Atlas account or local MongoDB setup.

### Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables:
   Create a `.env` file in the `backend` folder with:
   ```env
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
6. The backend will be running at `http://localhost:5000`.

---

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

---

## Authors

Developed by Prashirjan Shrestha.
