import { CreateRoomData } from "../types";
export declare class RoomsModel {
    static create(roomData: CreateRoomData): Promise<string>;
    static findById(id: string): Promise<any | undefined>;
    static findByName(name: string): Promise<any | undefined>;
    static getAll(): Promise<any[]>;
    static update(id: string, roomData: Partial<CreateRoomData>): Promise<any | undefined>;
    static delete(id: string): Promise<void>;
}
//# sourceMappingURL=roomsModel.d.ts.map