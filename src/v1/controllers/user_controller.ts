import { NextFunction, Request, Response } from "express";

import { CustomHttpErrorModel } from "../../models/custom_http_error_model";
import * as userService from "../services/user_service";
import { profile } from "console";

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
    next(error);
  }
};

export const patchProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nickname, profileImg } = req.body;

    const userId = req.decoded!.id;
    const user = req.user!;
    const newUser = await userService.updateProfile({
      userId,
      user,
      files:
        req.files !== undefined
          ? (req.files as Express.Multer.File[])
          : undefined,

      nickname,
      newProfileImg: profileImg,
    });

    return res.status(200).json(newUser);

    // return res.status(200).send({ status: "SUCCESS", user });
  } catch (error: any) {
    next(error);
  }
};

export const deleteKakaoUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const userId = req.decoded!.id;

    if (user === null || user === undefined) {
      throw new CustomHttpErrorModel({
        status: 400,
        message: "유저가 없습니다.",
      });
    }

    await userService.deleteKakaoUser(user, userId);

    return res.status(200).json({});
  } catch (error: any) {
    next(error);
  }
};

export const deleteEmailUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const userId = req.decoded!.id;

    if (user === null || user === undefined) {
      throw new CustomHttpErrorModel({
        status: 400,
        message: "유저가 없습니다.",
      });
    }

    await userService.deleteEmailUser(user, userId);

    return res.status(200).json({});
  } catch (error: any) {
    next(error);
  }
};

export const deleteGoogleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.body;

    await userService.deleteGoogleUser(code);

    return res.status(200).json({});
  } catch (error: any) {
    next(error);
  }
};

export const deleteAppleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.body;

    await userService.deleteAppleUser(code);

    return res.status(200).json({});
  } catch (error: any) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await userService.logout(req.decoded!.id);
    return res.status(200).json({});
  } catch (error: any) {
    next(error);
  }
};
