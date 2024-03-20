import { ObjectId, Types } from "mongoose";
import { EmailVerify, EmailVerifyModel } from "../models/email_verify_model";

/**
 * @DESC create new User
 * mongoDB에 새로운 user를 생성함
 */
export const createEmailVerify = async (emailVerify: EmailVerify) => {
  try {
    const savedEmailVerify = EmailVerifyModel.create(emailVerify);
    // save 하기
    return savedEmailVerify;
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC search EmailVerify
 * mongoDB에 email의 인증번호와 일치하는 항목 있는지 여부 확인
 */

export const searchEmailVerify = async (
  email: string,
  verificationCode: string
) => {
  try {
    const result = await EmailVerifyModel.findOne({
      email,
      verificationCode,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC update EmailVerify
 */
export const updateEmailVerify = async (
  id: Types.ObjectId,
  updateObj: Object
) => {
  try {
    const result = await EmailVerifyModel.updateOne({ _id: id }, updateObj);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC delete EmailVerify
 */
export const deleteEmailVerify = async (email: string) => {
  try {
    const result = await EmailVerifyModel.deleteOne({ email });
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC delete all EmailVerify by email
 */
export const deleteAllEmailVerifyByEmail = async (email: string) => {
  try {
    const result = await EmailVerifyModel.deleteMany({ email });
  } catch (error) {}
};
