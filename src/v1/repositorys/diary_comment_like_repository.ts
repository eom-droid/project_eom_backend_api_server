import { Types } from "mongoose";
import {
  DiaryPaginateReqModel,
  PaginateReqModel,
} from "../../models/paginate_req_model";
import { DiaryCommentLikeModel } from "../models/diary_comment_like_model";
import { Diary, DiaryModel } from "../models/diary_model";
import { DiaryCommentModel } from "../models/diary_comment_model";

/**
 * @DESC create new diary comment like
 * 새로운 diary comment like를 생성함
 */
export const createDiaryCommentLike = async (
  commentId: string,
  userId: string
) => {
  try {
    await DiaryCommentLikeModel.create({
      commentId: commentId,
      userId: userId,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC delete diary comment like
 * diary comment like를 삭제함
 */
export const deleteDiaryCommentLike = async (
  commentId: string,
  userId: string
) => {
  try {
    await DiaryCommentLikeModel.deleteOne({
      commentId: commentId,
      userId: userId,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC get diary comment like
 * diary comment like를 가져옴
 */
export const getDiaryCommentLike = async (
  commentId: string,
  userId: string
) => {
  try {
    return await DiaryCommentLikeModel.findOne({
      commentId: commentId,
      userId: userId,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC deleteDiarryCommentLike by commentId
 * commentId로 diary comment like를 삭제함
 */
export const deleteDiaryCommentLikeByCommentId = async (commentId: string) => {
  try {
    await DiaryCommentLikeModel.deleteMany({
      commentId: commentId,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC deleteDiarryCommentLike by userId
 * userId로 diary comment like를 삭제함
 */
export const deleteDiaryCommentLikeByUserId = async (userId: string) => {
  try {
    await DiaryCommentLikeModel.deleteMany({ userId });
  } catch (error) {
    throw error;
  }
};
