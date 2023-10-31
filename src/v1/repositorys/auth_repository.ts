import { DiaryPaginateReqModel } from "../../models/diary_paginate_req_model";
import { Diary, DiaryModel } from "../models/diary_model";
import { User, UserModel } from "../models/user_model";

import { log } from "console";

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
    console.log(new Date().toISOString() + ": npm log: " + error);

    throw { status: 400, message: "입력값이 유효하지 않습니다." };
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
  return await searchUser({ id });
};

export const searchUserByEmail = async (email: string) => {
  return await searchUser({ email });
};

const searchUser = async (searchObj: Object) => {
  try {
    const searchedUser = await UserModel.findOne(searchObj);
  } catch (error: any) {
    console.log(new Date().toISOString() + ": npm log: " + error);
    throw { status: 400, message: "입력값이 유효하지 않습니다." };
  }
};
