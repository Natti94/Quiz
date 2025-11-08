# Quiz Backend

Node.js/Express backend for the Quiz application. Proxies authentication to teacher's Chatify API and manages quiz scores/leaderboard in MongoDB.

## Features

- **Authentication Proxy**: Forwards register/login requests to teacher's API
- **User Management**: Syncs user data to MongoDB
- **Leaderboard System**: Tracks quiz scores and rankings
- **JWT Authentication**: Secure API endpoints
- **MongoDB Storage**: Persistent data storage

## Tech Stack

- **Runtime**: Node.js with ES6 modules
- **Framework**: Express 4.18
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **HTTP Client**: node-fetch

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

The backend uses the `.env` file in the **root directory** (`quiz/.env`).

This shared environment file contains configuration for both frontend and backend:

- Frontend uses `VITE_*` prefixed variables
- Backend uses `MONGODB_URI`, `JWT_SECRET`, `TEACHER_API_*`, `PORT`, `CORS_ORIGIN`, etc.

Make sure the root `.env` file contains:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/quiz-frontend
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production

# Teacher's Chatify API
TEACHER_API_BASE=https://chatify-api.up.railway.app
TEACHER_API_CSRF_ENDPOINT=https://chatify-api.up.railway.app/csrf
TEACHER_API_TOKEN_ENDPOINT=https://chatify-api.up.railway.app/auth/token
TEACHER_API_REGISTER_ENDPOINT=https://chatify-api.up.railway.app/auth/register

# ... (see root .env for complete configuration)
```

### 3. Start MongoDB

**Local MongoDB:**

```bash
mongod
```

**Or use MongoDB Atlas** (cloud-hosted MongoDB)

### 4. Run Server

**Development (with auto-reload):**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "student123",
  "email": "student@example.com",
  "password": "securepassword",
  "avatar": "https://example.com/avatar.jpg" (optional)
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "student123",
  "password": "securepassword"
}
```

Response:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "student123",
    "email": "student@example.com",
    "totalQuizzes": 5,
    "totalScore": 42
  }
}
```

#### Logout User

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Leaderboard

#### Save Quiz Score

```http
POST /api/leaderboard
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject": "plu",
  "mode": "AI",
  "score": 8,
  "totalQuestions": 10,
  "attempted": 10,
  "timeTaken": 120
}
```

#### Get Leaderboard Rankings

```http
GET /api/leaderboard?subject=plu&mode=AI&limit=10&skip=0
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "username": "student123",
      "subject": "plu",
      "mode": "AI",
      "score": 8,
      "totalQuestions": 10,
      "percentage": 80,
      "completedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 10,
    "skip": 0,
    "hasMore": true
  }
}
```

#### Get Top Scores by Subject

```http
GET /api/leaderboard/top/plu?limit=10&mode=AI
```

#### Get User's Quiz History

```http
GET /api/leaderboard/user/:userId?limit=20&skip=0
```

#### Get User Statistics

```http
GET /api/leaderboard/stats/:userId
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "username": "student123",
      "totalQuizzes": 5,
      "totalScore": 42,
      "avgScorePerQuiz": "8.40"
    },
    "bySubject": [
      {
        "_id": "plu",
        "totalAttempts": 3,
        "avgScore": 7.5,
        "avgPercentage": 75,
        "bestScore": 9,
        "bestPercentage": 90
      }
    ],
    "byMode": [
      {
        "_id": "AI",
        "totalAttempts": 4,
        "avgScore": 8.2,
        "avgPercentage": 82
      }
    ]
  }
}
```

### Health Check

```http
GET /health
```

## Database Models

### User

```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  teacherApiToken: String,
  avatar: String,
  userId: String,
  totalQuizzes: Number (default: 0),
  totalScore: Number (default: 0),
  lastActive: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Leaderboard

```javascript
{
  user: ObjectId (ref: User),
  username: String (required),
  subject: String (enum: plu, plu-exam, apt, wai, wai-exam),
  mode: String (enum: standard, AI),
  score: Number (required),
  totalQuestions: Number (required),
  attempted: Number,
  percentage: Number (0-100),
  timeTaken: Number (seconds),
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Architecture

```
quiz-backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js  # Auth proxy logic
│   └── leaderboardController.js  # Leaderboard CRUD
├── middleware/
│   ├── auth.js            # JWT verification
│   └── errorHandler.js    # Global error handling
├── models/
│   ├── User.js            # User schema
│   └── Leaderboard.js     # Leaderboard schema
├── routes/
│   ├── auth.js            # Auth endpoints
│   └── leaderboard.js     # Leaderboard endpoints
├── .env.example           # Environment template
├── .gitignore
├── package.json
└── server.js              # Express app entry point
```

## Development

### Testing the API

Use tools like:

- **Postman**: GUI for API testing
- **Thunder Client**: VS Code extension
- **curl**: Command-line tool

Example with curl:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# Save score (replace <TOKEN> with actual JWT)
curl -X POST http://localhost:5000/api/leaderboard \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"subject":"plu","mode":"AI","score":8,"totalQuestions":10}'

# Get leaderboard
curl http://localhost:5000/api/leaderboard?subject=plu
```

### MongoDB Tools

**View data with MongoDB Compass** (GUI):

- Download: https://www.mongodb.com/products/compass
- Connect: `mongodb://localhost:27017`

**View data with mongosh** (CLI):

```bash
mongosh
use quiz-frontend
db.users.find().pretty()
db.leaderboards.find().pretty()
```

## Error Handling

All API responses follow this format:

**Success:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detail 1", "Detail 2"]
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `409` - Conflict (duplicate user)
- `500` - Internal Server Error

## Security

- Passwords are never stored (handled by teacher's API)
- JWT tokens for authentication
- CORS configured for specific origin
- Input validation on all endpoints
- MongoDB injection protection via Mongoose

## Future Enhancements

- [ ] Rate limiting
- [ ] Request logging with Morgan
- [ ] API documentation with Swagger
- [ ] WebSocket support for real-time leaderboard updates
- [ ] Caching with Redis
- [ ] Unit and integration tests
- [ ] Docker containerization

## License

Same as parent project
