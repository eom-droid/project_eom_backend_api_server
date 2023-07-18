import { DiaryPaginateReqModel } from "../../models/diary_paginate_req_model";
import { Diary, DiaryModel } from "../models/diary_model";

export const createDiary = async (diary: Diary) => {
  try {
    const diaryInstance = diary.toDiaryModel();
    // save 하기
    const savedDiary = await diaryInstance.save();
    return savedDiary;
  } catch (e: any) {
    console.log(e);
    throw { status: 400, message: "입력값이 유효하지 않습니다." };
  }
};

export const updateDiary = async (id: String, diary: Diary) => {
  try {
    // save 하기
    const updatedDiary = await DiaryModel.updateOne(
      { _id: id },
      diary.toJson()
    );

    return updatedDiary;
  } catch (e: any) {
    console.log(e);
    throw { status: 400, message: "입력값이 유효하지 않습니다." };
  }
};

export const getDiaries = async (paginateReq: DiaryPaginateReqModel) => {
  try {
    // txts, imgs, vids, contentOrder는 가져오지 않음
    var selectQuery = { txts: 0, imgs: 0, vids: 0, contentOrder: 0 };
    var filterQuery = paginateReq.generateQuery();

    return await DiaryModel.find(filterQuery, selectQuery)
      .sort({ postDT: -1 })
      .limit(paginateReq.count);
  } catch (e) {
    throw { status: 400, message: "값이 존재하지 않습니다." };
  }
};

export const getDiary = async (diaryId: string): Promise<Diary | null> => {
  try {
    return await DiaryModel.findById(diaryId);
  } catch (e) {
    throw { status: 400, message: "값이 존재하지 않습니다." };
  }
};

export const deleteDiary = async (diaryId: string): Promise<void> => {
  try {
    await DiaryModel.deleteOne({ _id: diaryId });
    return;
  } catch (e) {
    throw { status: 400, message: "값이 존재하지 않습니다." };
  }
};
