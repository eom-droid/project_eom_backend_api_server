import { Request } from "express";
import { customJwtPayload } from "../utils/auth_utils";
declare global {
  namespace Express {
    interface Request {
      decoded?: customJwtPayload;
    }
  }
}
