import { CustomHttpErrorModel } from "../../models/custom_http_error_model";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthUtils } from "../../utils/auth_utils";
import { RoleType } from "../../constant/default";
import * as UserRepository from "../repositorys/user_repository";

// 초기에는 특정 토큰을 영구적으로 부여해주는 방식을 채택
// -> 추후 로그인 시 토큰을 발급받아서 사용하는 방식으로 변경

/**
 * @DESC check authorization
 * 2023.07.20
 * 1. role check
 */
export const authCheck = (role: RoleType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
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
      // 뒤에 오는 Handler에서 사용할 수 있도록 decoded에 저장
      req.decoded = AuthUtils.verifyToken(splitToken[1]);
      if (role > RoleType.USER) {
        const user = await UserRepository.searchUserById(req.decoded.id);
        if (user === null) {
          throw new CustomHttpErrorModel({
            message: "No authorization",
            status: 401,
          });
        }
        if (user.role < role) {
          throw new CustomHttpErrorModel({
            message: "No authorization",
            status: 401,
          });
        }
        req.user = user.toObject();
      }
      next();
    } catch (error: any) {
      console.log(new Date().toISOString() + ": npm log: " + error);
      if (error.name === "TokenExpiredError") {
        return res
          .status(419)
          .send({ status: "FAILED", data: { error: "Token Expired" } });
      }

      return res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  };
};

// export const authCheck = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const { authorization } = req.headers;
//     if (!authorization) {
//       throw new CustomHttpErrorModel({
//         message: "No authorization",
//         status: 401,
//       });
//     }

//     const splitToken = authorization.split(" ");

//     if (splitToken.length !== 2 || splitToken[0] !== "Bearer") {
//       throw new CustomHttpErrorModel({
//         message: "No authorization",
//         status: 401,
//       });
//     }
//     // 뒤에 오는 Handler에서 사용할 수 있도록 decoded에 저장
//     req.decoded = AuthUtils.verifyToken(splitToken[1]);
//     next();

//     // const { MANAGER_TOKEN, CLIENT_TOKEN } = process.env;
//     // // 1. GET 메소드는 클라이언트도 접근 가능하도록 허용
//     // if (req.method === "GET") {
//     //   if (splitToken[1] !== MANAGER_TOKEN && splitToken[1] !== CLIENT_TOKEN) {
//     //     throw new CustomHttpErrorModel({
//     //       message: "No authorization",
//     //       status: 401,
//     //     });
//     //   }
//     // }
//     // // 2. POST, PATCH, DELETE 메소드는 관리자만 접근 가능하도록 허용
//     // else {
//     //   if (splitToken[1] !== MANAGER_TOKEN) {
//     //     throw new CustomHttpErrorModel({
//     //       message: "No authorization",
//     //       status: 401,
//     //     });
//     //   }
//     // }
//   } catch (error: any) {
//     // console.log(new Date().toISOString() + ": npm log: " + error);
//     // if (error.name === "TokenExpiredError") {
//     //   return res
//     //     .status(419)
//     //     .send({ status: "FAILED", data: { error: "Token Expired" } });
//     // }

//     return res
//       .status(error?.status || 500)
//       .send({ status: "FAILED", data: { error: error?.message || error } });
//   }
// };
