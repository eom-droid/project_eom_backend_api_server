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

// getLastIndexDiaryByDate
// params : date(Date)
// return : number | undefined
// des : 해당 function은 date를 받아서 해당 date의 마지막 index를 return하는 함수입니다.
export const getLastIndexDiaryByDate = async (
  date: Date
): Promise<number | undefined> => {
  try {
    var theDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var theDateTomorrow = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1
    );
    // 금일날짜와 postDT가 동일한 항목에 대해서
    // postDateInd를 기준으로 내림차순 정렬을 하고
    // 제일 큰 값을 가지고 온다.
    const result = await DiaryModel.findOne(
      {
        postDT: {
          $gte: theDate,
          $lt: theDateTomorrow,
        },
      },
      { postDateInd: 1 }
    ).sort({ postDateInd: -1 });
    return result?.postDateInd;
  } catch (e: any) {
    console.log(e);
    throw { status: 400, message: "값이 존재하지 않습니다." };
  }
};

export const getDiaries = async (paginateReq: DiaryPaginateReqModel) => {
  try {
    var selectQuery = { txts: 0, imgs: 0, vids: 0, contentOrder: 0 };
    var filterQuery = paginateReq.generateQuery();

    return await DiaryModel.find(filterQuery, selectQuery)
      .sort({ postDT: -1, postDateInd: -1 })
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
