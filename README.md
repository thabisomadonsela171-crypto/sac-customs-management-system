# SAC Customs Management System

A full-stack customs management application designed to support the management and tracking of customs-related operations, shipments, declarations, payments, customers and users.

## Project Overview

The **SAC Customs Management System** is a web-based application built to streamline customs administration through a centralized management platform.

The application combines a React frontend with a Node.js and Express backend, using SQLite for data storage and JSON Web Tokens (JWT) for authentication.

## Key Features

- **Dashboard:** Centralized overview of customs management activities.
- **Customer Management:** Manage customer information and records.
- **Shipment Management:** Create and manage shipment records.
- **Shipment Tracking:** Monitor shipment tracking information.
- **Customs Declarations:** Manage customs declarations.
- **Document Management:** Organize customs-related documents.
- **Payment Management:** Manage payment records.
- **User Management:** Manage system users.
- **Role-Based Access Control:** Restrict access according to user roles.
- **Notifications:** Manage system notifications.
- **Audit Logs:** Maintain records of system activities.

## Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React, JavaScript, HTML5, CSS3 |
| Build Tool | Vite |
| Backend | Node.js, Express.js |
| Database | SQLite |
| Authentication | JSON Web Tokens (JWT) |
| Password Security | bcryptjs |
| API Communication | REST API |
| Development Tools | npm, Git, GitHub |

## System Architecture

The application follows a frontend-backend architecture.

```text
             SAC CUSTOMS SYSTEM
                     |
          +----------+----------+
          |                     |
     React Frontend        Express Backend
          |                     |
       Vite App             REST API
                                |
                     Authentication & RBAC
                                |
                         SQLite Database
```

## Project Structure

```text
sac-customs-management-system/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   └── pages/
│   ├── index.html
│   └── package.json
│
├── .env.example
├── .gitignore
├── package.json
└── package-lock.json
```

## Getting Started

### Prerequisites

Install the following before running the application:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- [Git](https://git-scm.com/)

### 1. Clone the repository

```bash
git clone https://github.com/thabisomadonsela171-crypto/sac-customs-management-system.git
```

### 2. Navigate into the project

```bash
cd sac-customs-management-system
```

### 3. Install backend dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a local `.env` file in the project root using `.env.example` as your template.

Configure the required variables:

```env
JWT_SECRET=your_secure_random_secret
ADMIN_INITIAL_PASSWORD=your_secure_initial_password
```

Use strong, private values. Never commit your actual `.env` file to GitHub.

### 5. Start the backend

From the project root:

```bash
npm start
```

The backend runs at:

```text
http://localhost:4000
```

### 6. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 7. Start the frontend

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Security

The project incorporates several security-related measures:

- JWT-based authentication.
- Role-based access control.
- Password hashing using bcryptjs.
- Environment-based secret configuration.
- Git exclusions for private environment files.
- Exclusion of local SQLite database files from version control.

**Important:** Configure secure credentials before running the application. Do not publish passwords, JWT secrets, database files or other sensitive information.

## Testing and Validation

The project has undergone development checks, including:

- Backend JavaScript syntax validation.
- Frontend production build validation.
- Frontend lint checks.
- Backend HTTP health endpoint verification.

The frontend lint check completed with zero errors and 19 warnings. These warnings may require further code-quality improvements.

## Future Improvements

Potential areas for further development include:

- Automated backend and frontend testing.
- Enhanced reporting and analytics.
- Improved document processing.
- Deployment to a production hosting environment.
- Additional security and performance improvements.

## Author

**Thabiso Erick Madonsela**

Software Development | Application Development | Full-Stack Development

GitHub: [@thabisomadonsela171-crypto](https://github.com/thabisomadonsela171-crypto)

## Project Repository

[View SAC Customs Management System on GitHub](https://github.com/thabisomadonsela171-crypto/sac-customs-management-system)

---

*This project is part of my software development portfolio and demonstrates practical full-stack application development using modern web technologies.*
