import { DiaryPaginateReqModel } from "../../models/paginate_req_model";
import { Diary, DiaryModel } from "../models/diary_model";

/**
 * @DESC create new diary
 * 자체적인 diaryModel을 mongoDB diaryModel로 변환함
 * mongoDB에 새로운 diary를 생성함
 */
export const createDiary = async (diary: Diary) => {
  try {
    const diaryInstance = diary.toDiaryModel();
    // save 하기
    const savedDiary = await diaryInstance.save();
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
      diary.toJson()
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
