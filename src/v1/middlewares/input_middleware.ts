import { validationResult } from "express-validator/src/validation-result";
import { CustomHttpErrorModel } from "../../models/custom_http_error_model";
import { Request, Response, NextFunction } from "express";

export const inputMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req);
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      throw new CustomHttpErrorModel({
        message: "잘못된 요청입니다.",
        status: 400,
      });
    }

    next();
  } catch (error: any) {
    return res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};
