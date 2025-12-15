# ChatApp API (Backend)

Real-time chat application backend built with Node.js, Express, Socket.IO, and MongoDB.

## 🚀 Features

- **RESTful API** with Express.js
- **Real-time communication** with Socket.IO
- **JWT authentication** with HTTP-only cookies
- **MongoDB** database with Mongoose ODM
- **File uploads** with Multer and Cloudinary
- **Input validation** middleware
- **Error handling** middleware
- **TypeScript** for type safety
- **CORS** enabled for cross-origin requests

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account

## 🛠️ Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` file:

   ```env
   SERVER_PORT=5004
   CLIENT_URL=http://localhost:3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint    | Description       | Auth Required |
| ------ | ----------- | ----------------- | ------------- |
| POST   | `/register` | Register new user | ❌            |
| POST   | `/login`    | Login user        | ❌            |
| POST   | `/logout`   | Logout user       | ✅            |
| GET    | `/me`       | Get current user  | ✅            |

### Users (`/api/users`)

| Method | Endpoint | Description    | Auth Required |
| ------ | -------- | -------------- | ------------- |
| GET    | `/`      | Get all users  | ✅            |
| GET    | `/:id`   | Get user by ID | ✅            |

### Rooms (`/api/rooms`)

| Method | Endpoint | Description     | Auth Required |
| ------ | -------- | --------------- | ------------- |
| GET    | `/`      | Get all rooms   | ✅            |
| POST   | `/`      | Create new room | ✅            |

### Messages (`/api/messages`)

| Method | Endpoint           | Description          | Auth Required |
| ------ | ------------------ | -------------------- | ------------- |
| GET    | `/room/:roomId`    | Get room messages    | ✅            |
| POST   | `/room/:roomId`    | Send room message    | ✅            |
| GET    | `/private/:userId` | Get private messages | ✅            |
| POST   | `/private/:userId` | Send private message | ✅            |

### Health (`/api/health`)

| Method | Endpoint  | Description     | Auth Required |
| ------ | --------- | --------------- | ------------- |
| GET    | `/health` | Health check    | ❌            |
| GET    | `/`       | API information | ❌            |

## 🔌 Socket.IO Events

### Client → Server Events

| Event             | Data                                       | Description          |
| ----------------- | ------------------------------------------ | -------------------- |
| `room:join`       | `{ roomId: string }`                       | Join a chat room     |
| `room:leave`      | `{ roomId: string }`                       | Leave a chat room    |
| `message:room`    | `{ roomId: string, content: string }`      | Send room message    |
| `message:private` | `{ receiverId: string, content: string }`  | Send private message |
| `typing:start`    | `{ roomId?: string, receiverId?: string }` | Start typing         |
| `typing:stop`     | `{ roomId?: string, receiverId?: string }` | Stop typing          |

### Server → Client Events

| Event             | Data                              | Description             |
| ----------------- | --------------------------------- | ----------------------- |
| `user:online`     | `User`                            | User comes online       |
| `user:offline`    | `{ id: string }`                  | User goes offline       |
| `message:room`    | `Message`                         | Receive room message    |
| `message:private` | `Message`                         | Receive private message |
| `typing:start`    | `{ user: User, roomId?: string }` | User starts typing      |
| `typing:stop`     | `{ user: User, roomId?: string }` | User stops typing       |

## 🗂️ Project Structure

```
src/
├── config/
│   └── db.ts                # MongoDB configuration
├── controllers/
│   ├── authController.ts    # Authentication logic
│   ├── userController.ts    # User management
│   ├── roomController.ts    # Room management
│   └── messageController.ts # Message handling
├── middlewares/
│   ├── authMiddleware.ts    # JWT authentication
│   ├── errorHandler.ts      # Error handling
│   ├── validator.ts         # Input validation
│   └── upload.ts            # File upload (Cloudinary)
├── models/
│   ├── User.ts              # User schema
│   ├── Room.ts              # Room schema
│   └── Message.ts           # Message schema
├── routes/
│   ├── authRoutes.ts        # Auth endpoints
│   ├── userRoutes.ts        # User endpoints
│   ├── roomRoutes.ts        # Room endpoints
│   └── messageRoutes.ts     # Message endpoints
├── services/
│   └── socket.ts            # Socket.IO logic
├── types/
│   └── index.ts             # TypeScript types
├── utils/
│   └── mongodb.ts           # MongoDB utilities
└── server.ts                # Server entry point
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in
2. Server generates JWT token
3. Token stored in HTTP-only cookie
4. Client sends cookie with each request
5. Middleware verifies token

## ✅ Input Validation

All inputs are validated using custom middleware:

- **Email**: Valid email format
- **Password**: Minimum 6 characters
- **Username**: 3-20 characters, alphanumeric + underscore
- **Room Name**: 1-50 characters
- **Message Content**: 1-1000 characters

## ⚠️ Error Handling

Comprehensive error handling for:

- MongoDB errors (duplicate key, validation, cast)
- JWT errors (invalid token, expired)
- Custom application errors
- 404 errors for undefined routes
- 500 errors for server issues

## 🧪 Testing

Run tests:

```bash
npm test
```

## 📦 Dependencies

### Core

- `express` - Web framework
- `socket.io` - Real-time communication
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing

### Middleware

- `cors` - Cross-origin resource sharing
- `cookie-parser` - Cookie parsing
- `multer` - File upload
- `cloudinary` - Cloud image storage

### Development

- `typescript` - Type safety
- `ts-node-dev` - Development server
- `dotenv` - Environment variables

## 🚀 Deployment

### Environment Variables

Make sure to set all required environment variables:

```env
SERVER_PORT=5004
CLIENT_URL=https://your-frontend-url.com
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## 📝 License

MIT

## 👨‍💻 Author

Built with ❤️ by Zakar
