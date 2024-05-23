import { Types } from "mongoose";
import { PaginateReqModel } from "../../models/paginate_req_model";
import { DiaryCommentModel } from "../models/diary_comment_model";

/**
 * @DESC get diary comments
 * diary의 댓글을 가져옴
 * 미완성
 */
export const getDiaryComments = async ({
  diaryId,
  userId,
  paginateReq,
}: {
  diaryId: string;
  userId?: string;
  paginateReq: PaginateReqModel;
}) => {
  try {
    const filterQuery = paginateReq.generateQuery(true);
    const result = await DiaryCommentModel.aggregate([
      {
        $match: {
          // diaryId가 일치하고
          diaryId: new Types.ObjectId(diaryId),
          // after값을 삽입하여 이후의 document만 가져옴
          ...filterQuery,
        },
      },
      // _id를 기준으로 정렬함
      { $sort: { _id: 1 } },
      // limit을 통해 가져올 document의 개수를 정함
      { $limit: paginateReq.count },
      // lookup을 통해 diaryCommentLikes 정보를 가져옴
      {
        $lookup: {
          from: "diarycommentlikes",
          localField: "_id",
          foreignField: "commentId",
          as: "diaryCommentLikes",
        },
      },
      // lookup을 통해 user 정보를 가져옴
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "writer",
        },
      },
      // lookup을 통해 reply의 count를 가져옴
      {
        $lookup: {
          from: "diaryreplies",
          localField: "_id",
          foreignField: "commentId",
          as: "reply",
        },
      },
      // $unwind는 배열을 풀어서 하나의 document로 만들어줌
      {
        $unwind: "$writer",
      },
      {
        $project: {
          _id: 1,
          writer: "$writer",
          content: 1,
          createdAt: 1,
          likeCount: { $size: "$diaryCommentLikes" },
          isLike:
            userId === undefined
              ? { $literal: false }
              : {
                  $cond: {
                    if: {
                      $in: [
                        new Types.ObjectId(userId),
                        "$diaryCommentLikes.userId",
                      ],
                    },
                    then: true,
                    else: false,
                  },
                },
          replyCount: { $size: "$reply" },
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

/**
 * @DESC delete diary comment by userId
 * userId로 diary에 댓글을 삭제함
 */
export const deleteDiaryCommentByUserId = async (userId: string) => {
  try {
    const result = await DiaryCommentModel.deleteMany({
      userId: userId,
    });
    return result;
  } catch (error: any) {
    throw error;
  }
};
