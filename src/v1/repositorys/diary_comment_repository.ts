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
      // req.query에 따라서 after를 적용하여 pagination을 진행함
      { $match: filterQuery },
      // createdAt을 기준으로 내림차순 정렬 -> 최신순으로 정렬
      // 이 부분은 mongodb는 기본으로 id를 기준점으로 정렬하기 때문에 뺐음
      { $sort: { _id: -1 } },
      // 위에서 sorting 후 limit을 적용하여 pagination을 진행함
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
          localField: "userId",
          foreignField: "_id",
          as: "writer",
        },
      },
      {
        $unwind: "$writer",
      },

      {
        $project: {
          _id: 1,
          // diaryId: 1,
          // user의 경우에는 user의 모든 정보를 가져오기 때문에 필요한 정보만 가져오도록 함
          writer: {
            _id: "$writer._id",
            nickname: "$writer.nickname",
            profileImg: "$writer.profileImg",
            role: "$writer.role",
          },
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
        },
      },
    ]);
    console.log(result);
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
