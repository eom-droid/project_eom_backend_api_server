import { Types } from "mongoose";
import {
  DiaryPaginateReqModel,
  PaginateReqModel,
} from "../../models/paginate_req_model";
import { DiaryLikeModel } from "../models/diary_like_model";
import { Diary, DiaryModel } from "../models/diary_model";
import { DiaryCommentModel } from "../models/diary_comment_model";

/**
 * @DESC like diary
 * diary를 좋아요함
 */
export const createDiaryLike = async (diaryId: string, userId: string) => {
  try {
    await DiaryLikeModel.create({
      diaryId: diaryId,
      userId: userId,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC unlike diary
 * @param diaryId
 * @param userId
 * diary를 좋아요 취소함
 */
export const deleteDiaryLike = async (diaryId: string, userId: string) => {
  try {
    await DiaryLikeModel.deleteOne({
      diaryId: diaryId,
      userId: userId,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC get like diary
 * @param diaryId
 * @param userId
 * diary를 좋아요 했는지 확인함
 */
export const getDiaryLike = async (diaryId: string, userId: string) => {
  try {
    return await DiaryLikeModel.findOne({
      diaryId: diaryId,
      userId: userId,
    });
  } catch (error) {
    throw error;
  }
};
