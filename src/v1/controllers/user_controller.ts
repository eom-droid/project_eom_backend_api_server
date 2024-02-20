import { NextFunction, Request, Response } from "express";

import { CustomHttpErrorModel } from "../../models/custom_http_error_model";
import * as userService from "../services/user_service";

export const getMyInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. header에서 access token을 받아옴
  // 2. access token 검증
  // 3. 검증된 payload에서 encryptedId를 추출
  // 4. encryptedId를 복호화하여 id를 추출
  // 5. id를 통해 user를 찾음
  // 6. user를 response
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new CustomHttpErrorModel({
        status: 400,
        message: "Authorization header가 없습니다.",
      });
    }

    const user = req.user;

    if (user === null || user === undefined) {
      throw new CustomHttpErrorModel({
        status: 400,
        message: "유저가 없습니다.",
      });
    }
    user.password = undefined;

    return res.status(200).json(user);

    // return res.status(200).send({ status: "SUCCESS", user });
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};

export const updateNickname = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nickname } = req.body;

    if (!nickname) {
      throw new CustomHttpErrorModel({
        status: 400,
        message: "닉네임이 없습니다.",
      });
    }

    const userId = req.decoded!.id;
    await userService.updateNickname(userId, nickname);

    return res.status(200).json({});

    // return res.status(200).send({ status: "SUCCESS", user });
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};
