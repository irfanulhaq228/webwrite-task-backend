# Task Management Backend

A robust Node.js/Express backend for the Task Management App with JWT authentication, MongoDB integration, and comprehensive CRUD operations.

## 🚀 Features

### ✅ **Express.js RESTful APIs**

- Complete RESTful API design
- Proper HTTP status codes
- Comprehensive error handling
- Input validation with express-validator

### ✅ **MongoDB with Mongoose**

- MongoDB database integration
- Mongoose ODM for data modeling
- Optimized queries with indexing
- Data validation and schema enforcement

### ✅ **JWT-based Authentication**

- Secure user registration and login
- JWT token generation and validation
- Password hashing with bcryptjs
- Protected routes with middleware

### ✅ **CRUD Operations on Tasks**

- **Create**: Add new tasks with validation
- **Read**: Get tasks with filtering and pagination
- **Update**: Modify task details and status
- **Delete**: Remove tasks with confirmation

### ✅ **Task Filtering by Status**

- Filter tasks by status (Pending, In Progress, Completed)
- Sort tasks by various criteria
- Pagination support
- Advanced query parameters

### ✅ **Proper Error Handling**

- Comprehensive error messages
- HTTP status codes (200, 201, 400, 401, 404, 500)
- Validation error handling
- Database error handling

## 🛠️ Tech Stack

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **CORS**: Cross-origin resource sharing

## 📁 Project Structure

```
backend/
├── models/
│   ├── User.js          # User model with authentication
│   └── Task.js          # Task model with status filtering
├── routes/
│   ├── auth.js          # Authentication routes
│   └── tasks.js         # Task CRUD routes
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── server.js            # Main server file
├── config.env           # Environment variables
└── package.json         # Dependencies and scripts
```

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file from the template:

```bash
cp config.env .env
```

Update the `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb+srv://irfanulhaq228:personal@personal.mckn1ni.mongodb.net/task-management
JWT_SECRET=irfanulhaq-secret-key-2025-2024
NODE_ENV=development
```

### 3. Start the Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## 📖 API Documentation

### Authentication Endpoints

#### POST /api/auth/register

Register a new user

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/auth/login

Login user

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### GET /api/auth/profile

Get user profile (requires authentication)

```
Headers: Authorization: Bearer <jwt_token>
```

### Task Endpoints

#### GET /api/tasks

Get all tasks for authenticated user

```
Headers: Authorization: Bearer <jwt_token>
Query Parameters:
- status: Filter by status (Pending, In Progress, Completed)
- sortBy: Sort field (createdAt, dueDate, title, status)
- sortOrder: Sort order (asc, desc)
- page: Page number (default: 1)
- limit: Items per page (default: 10)
```

**Example:**

```
GET /api/tasks?status=Pending&sortBy=dueDate&sortOrder=asc&page=1&limit=5
```

#### POST /api/tasks

Create a new task

```json
{
  "title": "Complete project",
  "description": "Finish the task management app",
  "dueDate": "2024-01-15T10:00:00.000Z",
  "status": "Pending"
}
```

#### GET /api/tasks/:id

Get a specific task

```
Headers: Authorization: Bearer <jwt_token>
```

#### PUT /api/tasks/:id

Update a task

```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "dueDate": "2024-01-20T10:00:00.000Z",
  "status": "In Progress"
}
```

#### PATCH /api/tasks/:id/status

Update task status

```json
{
  "status": "Completed"
}
```

#### DELETE /api/tasks/:id

Delete a task

```
Headers: Authorization: Bearer <jwt_token>
```

## 🔐 Authentication

All task endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Task Status Options

- **Pending**: Task is not started
- **In Progress**: Task is currently being worked on
- **Completed**: Task is finished

## 🎯 Features Implemented

### ✅ **Express.js RESTful APIs**

- RESTful design principles
- Proper HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Consistent API structure
- Resource-based URLs

### ✅ **MongoDB with Mongoose**

- MongoDB connection with error handling
- Mongoose schemas with validation
- Database indexing for performance
- Population of related data

### ✅ **JWT-based Authentication**

- Secure token generation
- Password hashing with bcryptjs
- Token validation middleware
- User session management

### ✅ **CRUD Operations**

- **Create**: POST /api/tasks
- **Read**: GET /api/tasks, GET /api/tasks/:id
- **Update**: PUT /api/tasks/:id, PATCH /api/tasks/:id/status
- **Delete**: DELETE /api/tasks/:id

### ✅ **Task Filtering by Status**

- Filter by status (Pending, In Progress, Completed)
- Sort by multiple fields
- Pagination support
- Advanced query parameters

### ✅ **Error Handling**

- HTTP status codes (200, 201, 400, 401, 404, 500)
- Detailed error messages
- Validation error handling
- Database error handling

## 🧪 Testing

Test the API endpoints using curl or Postman:

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123"}'
```

## 🚀 Deployment

1. Set up environment variables for production
2. Use a process manager like PM2
3. Set up MongoDB Atlas or production MongoDB
4. Configure CORS for your frontend domain

## 📝 Error Codes

- `AUTH_TOKEN_MISSING`: No JWT token provided
- `INVALID_TOKEN`: Invalid JWT token
- `TOKEN_EXPIRED`: JWT token has expired
- `USER_NOT_FOUND`: User not found in database
- `TASK_NOT_FOUND`: Task not found
- `INVALID_TASK_ID`: Invalid task ID format
- `USER_EXISTS`: User already exists during registration
- `INVALID_CREDENTIALS`: Wrong email or password

The backend is production-ready with comprehensive error handling, validation, and security measures implemented.
