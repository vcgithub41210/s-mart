
# S-MART - Smart Inventory Management System

![S-MART Logo](https://img.shields.io/badge/S--MART-Inventory%20Management-blue?style=for-the-badge&logo=react)


## 🌟 Overview

S-MART is a comprehensive inventory management system designed specifically for small shops and vendors. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js), it provides real-time inventory tracking, order management, and analytics with role-based access control.

## ✨ Features

### Core Features
- 📦 **Real-time Inventory Tracking** - Monitor stock levels with automatic alerts
- 📊 **Comprehensive Dashboard** - Analytics and insights at a glance
- 🛒 **Order Management** - Place and track customer orders
- 🚨 **Low Stock Alerts** - Automated notifications for low inventory
- 💰 **Revenue Analytics** - Daily, weekly, monthly, and total revenue tracking
- 🔍 **Advanced Search & Filtering** - Find products quickly by name, category, or SKU
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### Authentication & Security
- 🔐 **JWT Authentication** - Secure token-based authentication
- 👥 **Role-Based Access Control** - Admin and Staff roles with different permissions
- 🛡️ **Protected Routes** - Secure API endpoints with middleware protection
- 🔑 **Password Encryption** - Secure bcrypt password hashing

### User Management
- **Admin Role**: Full system access including user creation and product management
- **Staff Role**: Limited access for day-to-day operations


## 🛠️ Technology Stack

### Frontend
- **React.js** (v18+) - User interface library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **CSS3** - Modern styling with flexbox and grid

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **CORS** - Cross-origin resource sharing


## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14.0.0 or later)
- **npm** (v6.0.0 or later)
- **MongoDB** (v4.0.0 or later)
- **Git** (for cloning the repository)

## 🚀 Installation

### 1. Clone the Repository

```
git clone https://github.com/yourusername/s-mart-inventory.git
cd s-mart-inventory
```

### 2. Install Backend Dependencies

```
cd backend
npm install
```

### 3. Install Frontend Dependencies

```
cd ../frontend
npm install
```

### 4. Set Up Environment Variables

Create a `.env` file in the backend directory:

```
Database Configuration
MONGODB_URI=mongodb://localhost:27017/smart_inventory

JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters
JWT_EXPIRES_IN=7d

Server Configuration
PORT=5000
NODE_ENV=development

Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 5. Run Backend and Frontend

```
cd backend
npm start

cd frontend
npm start
```




