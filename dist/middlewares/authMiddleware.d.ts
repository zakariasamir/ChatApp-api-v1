import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";
declare const auth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export default auth;
//# sourceMappingURL=authMiddleware.d.ts.map