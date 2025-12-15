# MongoDB Setup Guide

## Environment Variables

Add these variables to your `.env` file:

```env
# Server Configuration
NODE_ENV=development
SERVER_PORT=5004
CLIENT_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp?retryWrites=true&w=majority

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string and replace the placeholders in MONGODB_URI

## Connection String Format

```
mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
```

Example:

```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/chatapp?retryWrites=true&w=majority
```

## What's Changed

- ✅ Switched from PostgreSQL/Knex to MongoDB/Mongoose
- ✅ Created MongoDB schemas for User, Room, and Message
- ✅ Updated TypeScript types to use MongoDB ObjectIds
- ✅ Added comprehensive connection checking and logging
- ✅ Maintained all existing functionality with MongoDB

## Next Steps

1. Add your MongoDB connection string to `.env`
2. Remove old Knex dependencies (optional)
3. Test the connection by running `npm run dev`


