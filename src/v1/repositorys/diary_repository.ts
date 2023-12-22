import { DiaryPaginateReqModel } from "../../models/paginate_req_model";
import { DiaryLikeModel } from "../models/diary_like_model";
import { Diary, DiaryModel } from "../models/diary_model";

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
export const getDiaries = async (paginateReq: DiaryPaginateReqModel) => {
  try {
    // txts, imgs, vids, contentOrder는 가져오지 않음
    var selectQuery = { txts: 0, imgs: 0, vids: 0, contentOrder: 0 };
    var filterQuery = paginateReq.generateQuery();

    return await DiaryModel.find(filterQuery, selectQuery)
      .sort({ createdAt: -1 })
      .limit(paginateReq.count);
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
// export const createDiaryLike = async (diaryId: string, userId: string) => {
//   try {
//     DiaryLikeModel.create({
//       diaryId: diaryId,
//       userId: userId,
//     });
//   } catch (error) {
//     throw error;
//   }
// };

// /**
//  * @DESC unlike diary
//  * @param diaryId
//  * @param userId
//  * diary를 좋아요 취소함
//  */
// export const deleteDiaryLike = async (diaryId: string, userId: string) => {
//   try {
//   } catch (error) {
//     throw error;
//   }
// };

// /**
//  * @DESC get like diary
//  * @param diaryId
//  * @param userId
//  * diary를 좋아요 했는지 확인함
//  */
// export const getDiaryLike = async (diaryId: string, userId: string) => {
//   try {
//     return await DiaryLikeModel.findOne({
//       diaryId: diaryId,
//       userId: userId,
//     });
//   } catch (error) {
//     throw error;
//   }
// };
