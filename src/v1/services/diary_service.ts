import { count } from "console";
import { DiaryPaginateReqModel } from "../../models/diary_paginate_req_model";
import { Meta, PaginateReturnModel } from "../../models/paginate_res_model";
import { Diary, DiaryModel, IDiary } from "../models/diary_model";

import * as diaryRepository from "../repositorys/diary_repository";

export const createDiary = async (
  diary: Diary,
  files: Express.Multer.File[] | undefined
) => {
  try {
    matchFileNames(diary, files);

    const lastIndOfPostDate = await diaryRepository.getLastIndexDiaryByDate(
      diary.postDT
    );
    diary.postDateInd =
      lastIndOfPostDate !== undefined ? lastIndOfPostDate + 1 : 0;

    return await diaryRepository.createDiary(diary);
  } catch (error: any) {
    throw { status: error?.status || 400, message: error?.message || error };
  }
};

export const updateDiary = async (
  id: string,
  diary: Diary,
  files: Express.Multer.File[] | undefined
) => {
  try {
    matchFileNames(diary, files);

    return await diaryRepository.updateDiary(id, diary);
  } catch (error: any) {
    throw { status: error?.status || 400, message: error?.message || error };
  }
};

export const getDiaries = async (
  paginateReq: DiaryPaginateReqModel
): Promise<PaginateReturnModel<IDiary>> => {
  const result = (await diaryRepository.getDiaries(paginateReq)) as IDiary[];

  return new PaginateReturnModel<IDiary>({
    meta: {
      count: result.length,
      hasMore: result.length === paginateReq.count,
    },
    data: result,
  });
};

export const getDiary = async (diaryId: string): Promise<Diary> => {
  const result = await diaryRepository.getDiary(diaryId);
  if (result == null) {
    throw { status: 400, message: "값이 존재하지 않습니다." };
  } else {
    return result;
  }
};

const matchFileNames = (
  diary: Diary,
  files: Express.Multer.File[] | undefined
) => {
  // 파일 이름 매칭 시켜주기
  if (files != undefined) {
    for (var i = 0; i < files.length; i++) {
      //@ts-ignore
      const filename = files[i].key;
      const originalname = files[i].originalname;

      // file 중에 thumbnail 값이 일치하다면 diaryObj.thumbnail에 넣어주기
      if (diary.thumbnail === originalname) {
        diary.thumbnail = filename;
      }

      // file 중에 img 값이 일치하다면 diaryDetailObj.imgs에 넣어주기
      const imgFoundIndex = diary.imgs.findIndex((e) => e === originalname);
      if (imgFoundIndex !== -1) {
        diary.imgs[imgFoundIndex] = filename;
        continue;
      }

      // file 중에 vid 값이 일치하다면 diaryDetailObj.vids에 넣어주기
      const vidFoundIndex = diary.vids.findIndex((e) => e === originalname);
      if (vidFoundIndex !== -1) {
        diary.vids[vidFoundIndex] = filename;
        continue;
      }
    }
  }
};
