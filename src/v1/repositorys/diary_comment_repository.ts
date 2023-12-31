import { Types } from "mongoose";
import { PaginateReqModel } from "../../models/paginate_req_model";
import { DiaryCommentModel } from "../models/diary_comment_model";

/**
 * @DESC get diary comments
 * diary의 댓글을 가져옴
 * 미완성
 */
export const getDiaryComments = async (
  diaryId: string,
  paginateReq: PaginateReqModel
) => {
  try {
    const filterQuery = paginateReq.generateQuery();
    const result = await DiaryCommentModel.aggregate([
      {
        $match: {
          diaryId: new Types.ObjectId(diaryId),
          isDeleted: { $ne: true },
          ...filterQuery,
        },
      },
      { $sort: { _id: 1 } },
      { $limit: paginateReq.count },
      {
        $lookup: {
          from: "diarycommentlikes",
          localField: "_id",
          foreignField: "diaryId",
          as: "diaryCommentLikes",
        },
      },
      {
        $lookup: {
          from: "users",
          let: { userId: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$userId"] },
              },
            },
            {
              $project: {
                _id: 1,
                nickname: 1,
                profileImg: 1,
                role: 1,
              },
            },
          ],
          as: "writer",
        },
      },
      {
        $addFields: {
          writer: {
            $cond: {
              if: { $ne: [{ $size: "$writer" }, 0] },
              then: { $arrayElemAt: ["$writer", 0] },
              else: null,
            },
          },
        },
      },
      {
        $match: {
          writer: { $ne: null },
        },
      },
      {
        $project: {
          _id: 1,
          writer: "$writer",
          content: 1,
          createdAt: 1,
          likeCount: { $size: "$diaryCommentLikes" },
          isLike: {
            $cond: {
              if: {
                $in: [
                  new Types.ObjectId(diaryId),
                  "$diaryCommentLikes.diaryId",
                ],
              },
              then: true,
              else: false,
            },
          },
          // 필요한 다른 필드들 추가
        },
      },
    ]);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC get diary comment by id
 * diary의 댓글을 id로 가져옴
 */
export const getDiaryCommentById = async (commentId: string) => {
  try {
    return await DiaryCommentModel.findById(commentId);
  } catch (e) {
    throw e;
  }
};

/**
 * @DESC create diary comment
 * diary에 댓글을 생성함
 */
export const createDiaryComment = async (
  diaryId: string,
  userId: string,
  content: string
) => {
  try {
    const result = await DiaryCommentModel.create({
      diaryId: diaryId,
      userId: userId,
      content: content,
    });
    return result;
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC delete diary comment
 * diary에 댓글을 삭제함
 */
export const deleteDiaryComment = async (commentId: string) => {
  try {
    const result = await DiaryCommentModel.deleteOne({
      _id: commentId,
    });
    return result;
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC patch isDeleted diary comment
 * diary의 댓글을 삭제함
 */
export const patchDiaryCommentIsDeletedTrue = async (
  commentId: string
): Promise<void> => {
  try {
    await DiaryCommentModel.updateOne({ _id: commentId }, { isDeleted: true });
    return;
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC update diary comment
 * diary에 댓글을 수정함
 */
export const updateDiaryComment = async (
  commentId: string,
  content: string
) => {
  try {
    const result = await DiaryCommentModel.updateOne(
      { _id: commentId },
      { content: content }
    );
    return result;
  } catch (error: any) {
    throw error;
  }
};
