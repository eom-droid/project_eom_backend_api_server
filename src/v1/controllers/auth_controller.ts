import axios from "axios";
import { Request, Response } from "express";
import * as authService from "../services/auth_service";

/**
 * @DESC get kakao token
 * @RETURN kakao
 * 오직 rest api만 사용 가능 추후 flutter sdk를 사용하여 진행할 예정
 */
export const kakao = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const user = authService.createKakaoUser(code);

    return res.status(200).send(user);
  } catch (error: any) {
    console.log(new Date().toISOString() + ": npm log: " + error);

    return res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};
