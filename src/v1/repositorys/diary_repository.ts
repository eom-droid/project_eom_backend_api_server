import { Types } from "mongoose";
import { DiaryPaginateReqModel } from "../../models/paginate_req_model";

import { Diary, DiaryModel } from "../models/diary_model";
import { diaryToJson } from "../models/diary_model";

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
    const updatedDiary = await DiaryModel.updateOne(
      { _id: id },
      diaryToJson(diary)
    );

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
      {
        $match: {
          isShown: { $ne: false },
          // Object를 ...로 풀어서 넣어줌
          ...filterQuery,
        },
      },
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
 * @DESC get diary detail with likeCount and isLike
 * findById를 통해 특정 diary의 모든 정보를 가져옴(DiaryDetail을 가져옴)
 */
export const getDiaryWithLike = async (diaryId: string) => {
  try {
    const result = await DiaryModel.aggregate([
      { $match: { _id: new Types.ObjectId(diaryId) } },
      {
        $lookup: {
          from: "diarylikes",
          localField: "_id",
          foreignField: "diaryId",
          as: "diaryLikes",
        },
      },
      {
        // get comment count
        $lookup: {
          from: "diarycomments",
          localField: "_id",
          foreignField: "diaryId",
          as: "diaryComments",
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
          txts: 1,
          imgs: 1,
          vids: 1,
          contentOrder: 1,
          createdAt: 1,
          likeCount: { $size: "$diaryLikes" },
          commentCount: { $size: "$diaryComments" },
          isLike: {
            $cond: {
              if: {
                $in: [new Types.ObjectId(diaryId), "$diaryLikes.diaryId"],
              },
              then: true,
              else: false,
            },
          },
        },
      },
    ]);
    if (result.length == 0) {
      return null;
    }

    return result[0];
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
 * @DESC patch isShown diary
 * diary의 isShown를 false로 변경함
 */
export const patchDiaryIsShownFalse = async (
  diaryId: string
): Promise<void> => {
  try {
    await DiaryModel.updateOne({ _id: diaryId }, { isShown: false });
    return;
  } catch (error) {
    throw error;
  }
};
