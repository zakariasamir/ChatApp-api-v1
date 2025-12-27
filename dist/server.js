"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
require("./config/db");
const socket_1 = __importDefault(require("./services/socket"));
const errorHandler_1 = require("./middlewares/errorHandler");
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const PORT = process.env.SERVER_PORT || 4000;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
});
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
(0, socket_1.default)(io);
app.use("/api", routes_1.default);
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is running" });
});
app.get("/api", (req, res) => {
    res.status(200).json({
        name: "ChatApp API",
        version: "1.0.0",
        description: "Real-time chat application API with Socket.IO",
        endpoints: {
            auth: "/api/v1/auth",
            users: "/api/v1/users",
            rooms: "/api/v1/rooms",
            messages: "/api/v1/messages",
            health: "/api/v1/health",
        },
    });
});
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.IO ready for connections`);
    console.log(`🌍 Client URL: ${process.env.CLIENT_URL}`);
});
//# sourceMappingURL=server.js.map