import { CreateUserData, UpdateUserData } from "../types";
export declare class UsersModel {
    static create(userData: CreateUserData): Promise<string>;
    static findById(id: string): Promise<any | undefined>;
    static findByEmail(email: string): Promise<any | undefined>;
    static findByUsername(username: string): Promise<any | undefined>;
    static findByEmailOrUsername(email: string, username: string): Promise<any | undefined>;
    static update(id: string, userData: UpdateUserData): Promise<any | undefined>;
    static updateOnlineStatus(id: string, isOnline: boolean): Promise<void>;
    static getAll(): Promise<any[]>;
    static getOnlineUsers(): Promise<any[]>;
    static delete(id: string): Promise<void>;
}
//# sourceMappingURL=usersModel.d.ts.map