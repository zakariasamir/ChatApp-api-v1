import { Request, Response } from "express";
interface CreateRoomRequest {
    name: string;
    description?: string;
    isPrivate?: boolean;
}
export declare const getAllRooms: (req: Request, res: Response) => Promise<void>;
export declare const createRoom: (req: Request<{}, {}, CreateRoomRequest>, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=roomController.d.ts.map