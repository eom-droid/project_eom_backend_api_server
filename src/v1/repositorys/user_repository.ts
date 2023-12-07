import { CustomHttpErrorModel } from "../../models/custom_http_error_model";
import { User, UserModel } from "../models/user_model";
import { Types } from "mongoose";

/**
 * @DESC create new User
 * mongoDB에 새로운 user를 생성함
 */
export const createUser = async (user: User) => {
  try {
    const userInstance = user.toUserModel();
    // save 하기
    const savedUser = await userInstance.save();
    return savedUser;
  } catch (error: any) {
    throw error;
  }
};

export const searchSnsUser = async ({
  snsId,
  provider,
}: {
  snsId?: string;
  provider?: string;
}) => {
  return await searchUser({ snsId, provider });
};

export const searchUserById = async (id: string) => {
  return await searchUser({ _id: new Types.ObjectId(id) });
};

export const searchUserByEmail = async (email: string) => {
  return await searchUser({ email });
};

const searchUser = async (searchObj: Object) => {
  try {
    return await UserModel.findOne(searchObj);
  } catch (error) {
    throw error;
  }
};
