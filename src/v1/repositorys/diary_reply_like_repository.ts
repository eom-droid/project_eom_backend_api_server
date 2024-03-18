import { DiaryReplyLikeModel } from "../models/diary_reply_like_model";

/**
 * @DESC create new diary reply like
 * 새로운 diary reply like를 생성함
 */
export const createDiaryReplyLike = async (replyId: string, userId: string) => {
  try {
    await DiaryReplyLikeModel.create({
      replyId: replyId,
      userId: userId,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC delete diary reply like
 * diary reply like를 삭제함
 */
export const deleteDiaryReplyLike = async (replyId: string, userId: string) => {
  try {
    await DiaryReplyLikeModel.deleteOne({
      replyId: replyId,
      userId: userId,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC get diary reply like
 * diary reply like를 가져옴
 */
export const getDiaryReplyLike = async (replyId: string, userId: string) => {
  try {
    return await DiaryReplyLikeModel.findOne({
      replyId: replyId,
      userId: userId,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC deleteDiarryReplyLike by replyId
 * replyId로 diary reply like를 삭제함
 */
export const deleteDiaryReplyLikeByReplyId = async (replyId: string) => {
  try {
    await DiaryReplyLikeModel.deleteMany({
      replyId: replyId,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC delete diary reply by userId
 * @param userId
 * userId로 diary reply 삭제
 */
export const deleteDiaryReplyLikeByUserId = async (userId: string) => {
  try {
    await DiaryReplyLikeModel.deleteMany({ userId });
  } catch (error) {
    throw error;
  }
};
