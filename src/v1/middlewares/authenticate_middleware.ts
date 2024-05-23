import { CustomHttpErrorModel } from "../../models/custom_http_error_model";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthUtils } from "../../utils/auth_utils";
import { RoleType } from "../../constant/default";
import * as UserRepository from "../repositorys/user_repository";
import { DateUtils } from "../../utils/date_utils";

// 초기에는 특정 토큰을 영구적으로 부여해주는 방식을 채택
// -> 추후 로그인 시 토큰을 발급받아서 사용하는 방식으로 변경

/**
 * @DESC check authorization
 * 2023.07.20
 * 1. role check
 */
export const authCheck = ({
  role,
  userRequire = false,
  canAccessWithoutToken = false,
}: {
  role: RoleType;
  userRequire?: boolean;
  canAccessWithoutToken?: boolean;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization, cs: clientSecret } = req.headers;

      // 로직상 여기를 먼저 진행함
      // 추가적으로 토큰이 없어도 접근 가능한 경우
      // authorization이 있는경우는 토큰이 있는 경우 -> 로그인한 사용자의 요청
      // 추가적으로 clien에서 null일때 안보냄
      if (canAccessWithoutToken && authorization === undefined) {
        if (
          clientSecret !== process.env.ACCESS_WITHOUT_TOKEN_CLIENT_SCERET_KEY
        ) {
          throw new CustomHttpErrorModel({
            message: "No authorization",
            status: 401,
          });
        }
        next();
        return;
      }

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
      if (userRequire) {
        const user = await UserRepository.searchUserById(req.decoded.id);

        if (user === null) {
          throw new CustomHttpErrorModel({
            message: "No User",
            status: 401,
          });
        }
        if (user.role < role) {
          throw new CustomHttpErrorModel({
            message: "No Permission",
            status: 401,
          });
        }

        req.user = user;
      }
      next();
    } catch (error: any) {
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      console.error(
        DateUtils.generateNowDateTime() + ": npm log: " + error + " from " + ip
      );
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
