import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

const environment = process.env.NODE_ENV || "development";

// Database connection check function
const connectToMongoDB = async (): Promise<void> => {
  try {
    console.log(
      `🔄 Attempting to connect to MongoDB (${environment} environment)...`
    );

    // MongoDB connection string from environment
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    // Connect to MongoDB
    await mongoose.connect(mongoUri);

    console.log(`✅ MongoDB connected successfully!`);
    console.log(`🗄️  Connected to database: ${mongoose.connection.name}`);
    console.log(`📊 MongoDB version: ${mongoose.version}`);

    // Get database info
    try {
      const collections = await mongoose.connection
        .db!.listCollections()
        .toArray();

      if (collections.length > 0) {
        const collectionNames = collections.map((col) => col.name);
        console.log(`📋 Available collections: ${collectionNames.join(", ")}`);
      } else {
        console.log(`⚠️  No collections found in the database`);
      }
    } catch (infoError) {
      console.log(
        `ℹ️  Connected but couldn't retrieve database info: ${infoError}`
      );
    }

    // Handle connection events
    mongoose.connection.on("error", (error) => {
      console.error("❌ MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️  MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB reconnected");
    });
  } catch (error: any) {
    console.error("❌ MongoDB connection failed:");
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code || "Unknown"}`);

    if (error.code === "ECONNREFUSED") {
      console.error("💡 Make sure your MongoDB server is running");
    } else if (error.code === "ENOTFOUND") {
      console.error("💡 Check your MongoDB host configuration");
    } else if (error.code === 8000) {
      console.error("💡 Check your MongoDB username and password");
    } else if (error.message.includes("MONGODB_URI")) {
      console.error("💡 Add MONGODB_URI to your .env file");
    }

    process.exit(1); // Exit the process if database connection fails
  }
};

// Check connection on startup
connectToMongoDB();

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🔄 Closing MongoDB connection...");
  await mongoose.connection.close();
  console.log("✅ MongoDB connection closed");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🔄 Closing MongoDB connection...");
  await mongoose.connection.close();
  console.log("✅ MongoDB connection closed");
  process.exit(0);
});

export default mongoose;
