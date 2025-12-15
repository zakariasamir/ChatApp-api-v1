import { CreateMessageData } from "../types";
export declare class MessagesModel {
    static create(messageData: CreateMessageData): Promise<string>;
    static findById(id: string): Promise<any | undefined>;
    static findByRoomId(roomId: string): Promise<any[]>;
    static findPrivateMessages(userId1: string, userId2: string): Promise<any[]>;
    static markAsRead(senderId: string, receiverId: string): Promise<void>;
    static update(id: string, messageData: Partial<CreateMessageData>): Promise<any | undefined>;
    static delete(id: string): Promise<void>;
    static deleteByRoomId(roomId: string): Promise<void>;
    static deleteByUserId(userId: string): Promise<void>;
}
//# sourceMappingURL=messagesModel.d.ts.map