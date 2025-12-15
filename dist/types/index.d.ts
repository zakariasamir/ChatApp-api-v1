import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
export interface User {
    _id: Types.ObjectId;
    username: string;
    email: string;
    password: string;
    profile_picture: string;
    is_online: boolean;
    created_at: Date;
    updated_at: Date;
}
export interface Room {
    _id: Types.ObjectId;
    name: string;
    description?: string;
    is_private: boolean;
    created_at: Date;
    updated_at: Date;
}
export interface Message {
    _id: Types.ObjectId;
    content: string;
    sender_id: Types.ObjectId;
    receiver_id?: Types.ObjectId;
    room_id?: Types.ObjectId;
    is_read: boolean;
    created_at: Date;
    updated_at: Date;
}
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface AuthResponse {
    message: string;
    user: {
        id: string;
        username: string;
        email: string;
        profile_picture: string;
    };
}
export interface UserResponse {
    user: {
        id: string;
        username: string;
        email: string;
        profile_picture: string;
    };
}
export interface JWTPayload {
    id: string;
    iat?: number;
    exp?: number;
}
export interface AuthenticatedRequest extends Request {
    user: User;
}
export type AuthenticatedHandler = (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void> | void;
export interface SocketData {
    id: string;
    username: string;
    profile_picture: string;
}
export interface ApiResponse<T = any> {
    message: string;
    data?: T;
    error?: string;
}
export interface HealthCheckResponse {
    status: string;
    message: string;
}
export interface EnvironmentVariables {
    NODE_ENV: string;
    SERVER_PORT: string;
    CLIENT_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    MONGODB_URI?: string;
    DB_HOST?: string;
    DB_PORT?: string;
    DB_NAME?: string;
    DB_USER?: string;
    DB_PASSWORD?: string;
    CLOUDINARY_CLOUD_NAME?: string;
    CLOUDINARY_API_KEY?: string;
    CLOUDINARY_API_SECRET?: string;
}
export interface CreateUserData {
    username: string;
    email: string;
    password: string;
    profile_picture?: string;
}
export interface UpdateUserData {
    username?: string;
    email?: string;
    password?: string;
    profile_picture?: string;
    is_online?: boolean;
}
export interface CreateRoomData {
    name: string;
    description?: string;
    is_private?: boolean;
}
export interface CreateMessageData {
    content: string;
    sender_id: Types.ObjectId;
    receiver_id?: Types.ObjectId;
    room_id?: Types.ObjectId;
}
export interface UploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
}
export interface CloudinaryUploadResult {
    public_id: string;
    version: number;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    access_mode: string;
    original_filename: string;
}
//# sourceMappingURL=index.d.ts.map