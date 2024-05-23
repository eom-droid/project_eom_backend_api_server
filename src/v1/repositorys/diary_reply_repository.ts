import { Types } from "mongoose";
import { PaginateReqModel } from "../../models/paginate_req_model";
import { DiaryReplyModel } from "../models/diary_reply_model";

/**
 * @DESC get diary Replys
 * diary의 대댓글을 가져옴
 */
export const getDiaryReplys = async ({
  commentId,
  userId,
  paginateReq,
}: {
  commentId: string;
  userId?: string;
  paginateReq: PaginateReqModel;
}) => {
  try {
    const filterQuery = paginateReq.generateQuery(true);

    const result = await DiaryReplyModel.aggregate([
      {
        $match: {
          // commentId가 일치하고
          commentId: new Types.ObjectId(commentId),
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
          from: "diaryreplylikes",
          localField: "_id",
          foreignField: "replyId",
          as: "diaryReplyLikes",
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
          likeCount: { $size: "$diaryReplyLikes" },
          isLike:
            userId === undefined
              ? { $literal: false }
              : {
                  $cond: {
                    if: {
                      $in: [
                        new Types.ObjectId(userId),
                        "$diaryReplyLikes.userId",
                      ],
                    },
                    then: true,
                    else: false,
                  },
                },
        },
      },
    ]);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC get diary reply by id
 * diary의 대댓글을 id로 가져옴
 */
export const getDiaryReplyById = async (replyId: string) => {
  try {
    return await DiaryReplyModel.findById(replyId);
  } catch (e) {
    throw e;
  }
};

/**
 * @DESC create diary reply
 * diary에 대댓글을 생성함
 */
export const createDiaryReply = async (
  commentId: string,
  userId: string,
  content: string
) => {
  try {
    const result = await DiaryReplyModel.create({
      commentId: commentId,
      userId: userId,
      content: content,
    });
    return result;
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC delete diary reply
 * diary의 대댓글을 삭제함
 */
export const deleteDiaryReply = async (replyId: string) => {
  try {
    const result = await DiaryReplyModel.deleteOne({
      _id: replyId,
    });
    return result;
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC update diary reply
 * diary에 대댓글을 수정함
 */
export const updateDiaryReply = async (replyId: string, content: string) => {
  try {
    const result = await DiaryReplyModel.updateOne(
      { _id: replyId },
      { content: content }
    );
    return result;
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC delete diary reply by userId
 * userId로 diary 대댓글 삭제
 */
export const deleteDiaryReplyByUserId = async (userId: string) => {
  try {
    await DiaryReplyModel.deleteMany({ userId });
  } catch (error) {
    throw error;
  }
};

// /**
//  * @DESC update diary comment
//  * diary에 댓글을 수정함
//  */
// export const updateDiaryComment = async (
//   commentId: string,
//   content: string
// ) => {
//   try {
//     const result = await DiaryCommentModel.updateOne(
//       { _id: commentId },
//       { content: content }
//     );
//     return result;
//   } catch (error: any) {
//     throw error;
//   }
// };
