import { Request } from "express";
import { customJwtPayload } from "../utils/auth_utils";
import { User } from "../v1/models/user_model";
declare global {
  namespace Express {
    interface Request {
      decoded?: customJwtPayload;
      user?: User;
    }
  }
}
