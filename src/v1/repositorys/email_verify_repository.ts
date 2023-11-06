import { EmailVerify } from "../models/email_verify_model";

/**
 * @DESC create new User
 * mongoDB에 새로운 user를 생성함
 */
export const createEmailVerify = async (emailVerify: EmailVerify) => {
  try {
    const emailVerifyInstance = emailVerify.toEmailVerifyModel();
    // save 하기
    const savedEmailVerify = await emailVerifyInstance.save();
    return savedEmailVerify;
  } catch (error: any) {
    console.log(new Date().toISOString() + ": npm log: " + error);

    throw { status: 400, message: "입력값이 유효하지 않습니다." };
  }
};
