import { CustomHttpErrorModel } from "../../models/custom_http_error_model";
import { User, UserModel } from "../models/user_model";
import { Types } from "mongoose";

/**
 * @DESC create new User
 * mongoDB에 새로운 user를 생성함
 */
export const createUser = async (user: User) => {
  try {
    const savedUser = await UserModel.create(user);
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

// 패스워드 업데이트 하기
export const updateUserPassword = async (email: string, password: string) => {
  try {
    return await UserModel.findOneAndUpdate({ email }, { password });
  } catch (error) {
    throw error;
  }
};

export const updateNickname = async (userId: string, nickname: string) => {
  try {
    return await UserModel.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      { nickname }
    );
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async ({
  userId,
  nickname,
  profileImg,
}: {
  userId: string;
  nickname: string;
  profileImg?: string;
}) => {
  try {
    if (profileImg === undefined) {
      return await UserModel.findOneAndUpdate(
        { _id: new Types.ObjectId(userId) },
        { nickname, $unset: { profileImg: 1 } },
        { new: true }
      );
    } else {
      return await UserModel.findOneAndUpdate(
        { _id: new Types.ObjectId(userId) },
        { nickname, profileImg },
        { new: true }
      );
    }
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    return await UserModel.deleteOne({ _id: userId });
  } catch (error) {
    throw error;
  }
};
