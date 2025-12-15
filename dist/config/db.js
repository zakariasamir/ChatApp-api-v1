"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const environment = process.env.NODE_ENV || "development";
const connectToMongoDB = async () => {
    try {
        console.log(`🔄 Attempting to connect to MongoDB (${environment} environment)...`);
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI environment variable is not set");
        }
        await mongoose_1.default.connect(mongoUri);
        console.log(`✅ MongoDB connected successfully!`);
        console.log(`🗄️  Connected to database: ${mongoose_1.default.connection.name}`);
        console.log(`📊 MongoDB version: ${mongoose_1.default.version}`);
        try {
            const collections = await mongoose_1.default.connection
                .db.listCollections()
                .toArray();
            if (collections.length > 0) {
                const collectionNames = collections.map((col) => col.name);
                console.log(`📋 Available collections: ${collectionNames.join(", ")}`);
            }
            else {
                console.log(`⚠️  No collections found in the database`);
            }
        }
        catch (infoError) {
            console.log(`ℹ️  Connected but couldn't retrieve database info: ${infoError}`);
        }
        mongoose_1.default.connection.on("error", (error) => {
            console.error("❌ MongoDB connection error:", error);
        });
        mongoose_1.default.connection.on("disconnected", () => {
            console.log("⚠️  MongoDB disconnected");
        });
        mongoose_1.default.connection.on("reconnected", () => {
            console.log("🔄 MongoDB reconnected");
        });
    }
    catch (error) {
        console.error("❌ MongoDB connection failed:");
        console.error(`   Error: ${error.message}`);
        console.error(`   Code: ${error.code || "Unknown"}`);
        if (error.code === "ECONNREFUSED") {
            console.error("💡 Make sure your MongoDB server is running");
        }
        else if (error.code === "ENOTFOUND") {
            console.error("💡 Check your MongoDB host configuration");
        }
        else if (error.code === 8000) {
            console.error("💡 Check your MongoDB username and password");
        }
        else if (error.message.includes("MONGODB_URI")) {
            console.error("💡 Add MONGODB_URI to your .env file");
        }
        process.exit(1);
    }
};
connectToMongoDB();
process.on("SIGINT", async () => {
    console.log("\n🔄 Closing MongoDB connection...");
    await mongoose_1.default.connection.close();
    console.log("✅ MongoDB connection closed");
    process.exit(0);
});
process.on("SIGTERM", async () => {
    console.log("\n🔄 Closing MongoDB connection...");
    await mongoose_1.default.connection.close();
    console.log("✅ MongoDB connection closed");
    process.exit(0);
});
exports.default = mongoose_1.default;
//# sourceMappingURL=db.js.map