import { Types } from "mongoose";
import { DiaryPaginateReqModel } from "../../models/paginate_req_model";
import { DiaryLikeModel } from "../models/diary_like_model";
import { Diary, DiaryModel } from "../models/diary_model";
import { DiaryCommentModel } from "../models/diary_comment_model";

/**
 * @DESC create new diary
 * 자체적인 diaryModel을 mongoDB diaryModel로 변환함
 * mongoDB에 새로운 diary를 생성함
 */
export const createDiary = async (diary: Diary) => {
  try {
    // save 하기
    const savedDiary = await DiaryModel.create(diary);
    return savedDiary;
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC update diary
 * diary 업데이트
 */
export const updateDiary = async (id: String, diary: Diary) => {
  try {
    // save 하기
    const updatedDiary = await DiaryModel.updateOne({ _id: id }, diary);

    return updatedDiary;
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC get diaries
 * pagination을 통해 특정 갯수만큼의 diary를 가져옴
 * txts, imgs, vids, contentOrder는 가져오지 않음
 */
export const getDiaries = async (
  paginateReq: DiaryPaginateReqModel,
  userId: string
) => {
  try {
    var filterQuery = paginateReq.generateQuery();
    const result = await DiaryModel.aggregate([
      // req.query에 따라서 after를 적용하여 pagination을 진행함
      { $match: filterQuery },
      // createdAt을 기준으로 내림차순 정렬 -> 최신순으로 정렬
      // 이 부분은 mongodb는 기본으로 id를 기준점으로 정렬하기 때문에 뺐음
      { $sort: { _id: -1 } },
      // 위에서 sorting 후 limit을 적용하여 pagination을 진행함
      { $limit: paginateReq.count },
      {
        $lookup: {
          from: "diarylikes",
          localField: "_id",
          foreignField: "diaryId",
          as: "diaryLikes",
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          writer: 1,
          weather: 1,
          hashtags: 1,
          thumbnail: 1,
          category: 1,
          isShown: 1,
          createdAt: 1,
          likeCount: { $size: "$diaryLikes" },
          isLike: {
            $cond: {
              if: { $in: [new Types.ObjectId(userId), "$diaryLikes.userId"] },
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
 * @DESC get diary detail
 * findById를 통해 특정 diary의 모든 정보를 가져옴(DiaryDetail을 가져옴)
 */
export const getDiary = async (diaryId: string): Promise<Diary | null> => {
  try {
    return await DiaryModel.findById(diaryId);
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC delete diary
 * diary를 삭제함
 */
export const deleteDiary = async (diaryId: string): Promise<void> => {
  try {
    await DiaryModel.deleteOne({ _id: diaryId });
    return;
  } catch (error) {
    throw error;
  }
};

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

/**
 * @DESC get diaries like count and isLike
 * diary array의 좋아요 갯수 와 내가 좋아요를 했는지 확인함
 */
export const getDiariesLikeCountAndIsLike = async (
  diaryList: Array<Types.ObjectId>,
  userId: String
) => {
  try {
    // 아래에 pagination을 적용하면 좋을듯
    const result = await DiaryModel.aggregate([
      {
        $match: { _id: { $in: diaryList } },
      },
      {
        $lookup: {
          from: "diarylikes",
          localField: "_id",
          foreignField: "diaryId",
          as: "diaryLikes",
        },
      },
      {
        $project: {
          _id: 1,
          likeCount: { $size: "$diaryLikes" },
          isLike: {
            $cond: {
              if: { $in: [userId, "$diaryLikes.userId"] },
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
