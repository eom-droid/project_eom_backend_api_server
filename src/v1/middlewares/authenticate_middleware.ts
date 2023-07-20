import { CustomHttpErrorModel } from "../../models/custom_http_error_model";
import { Request, Response, NextFunction } from "express";

// 초기에는 특정 토큰을 영구적으로 부여해주는 방식을 채택
// -> 추후 로그인 시 토큰을 발급받아서 사용하는 방식으로 변경

/**
 * @DESC check authorization
 * 2023.07.20
 * 1. GET 메소드는 클라이언트도 접근 가능하도록 허용
 * 2. POST, PATCH, DELETE 메소드는 관리자만 접근 가능하도록 허용
 */
export const authCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new CustomHttpErrorModel({
        message: "No authorization",
        status: 401,
      });
    }

    const splitToken = authorization.split(" ");

    if (splitToken.length !== 2 || splitToken[0] !== "Bearer") {
      throw new CustomHttpErrorModel({
        message: "No authorization",
        status: 401,
      });
    }

    const { MANAGER_TOKEN, CLIENT_TOKEN } = process.env;
    // 1. GET 메소드는 클라이언트도 접근 가능하도록 허용
    if (req.method === "GET") {
      if (splitToken[1] !== MANAGER_TOKEN && splitToken[1] !== CLIENT_TOKEN) {
        throw new CustomHttpErrorModel({
          message: "No authorization",
          status: 401,
        });
      }
    }
    // 2. POST, PATCH, DELETE 메소드는 관리자만 접근 가능하도록 허용
    else {
      if (splitToken[1] !== MANAGER_TOKEN) {
        throw new CustomHttpErrorModel({
          message: "No authorization",
          status: 401,
        });
      }
    }

    next();
  } catch (error: any) {
    return res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};
