import { DiaryPaginateReqModel } from "../../models/diary_paginate_req_model";
import { PaginateReturnModel } from "../../models/paginate_res_model";
import { Diary, IDiary } from "../models/diary_model";

import * as diaryRepository from "../repositorys/diary_repository";
import { AWSUtils } from "../../utils/aws_utils";

export const createDiary = async (
  diary: Diary,
  files: Express.Multer.File[] | undefined
) => {
  try {
    // 파일 업로드 및 이름 매칭
    if (files !== undefined) {
      const uploadCompleteFiles = await AWSUtils.uploadFileToS3({
        s3Path: "eom/diary/",
        file: files,
      });

      matchFileNames(diary, uploadCompleteFiles);
    }

    // lastIndOfPostDate는 해당 날짜에 해당하는 postDateInd의 마지막 값을 가져옴
    // pagination 때문에 postDateInd가 0부터 시작하므로 +1 해줌
    const lastIndOfPostDate = await diaryRepository.getLastIndexDiaryByDate(
      diary.postDT
    );

    diary.postDateInd =
      lastIndOfPostDate !== undefined ? lastIndOfPostDate + 1 : 0;

    return await diaryRepository.createDiary(diary);
  } catch (error: any) {
    console.log(error);
    throw { status: error?.status || 400, message: error?.message || error };
  }
};

export const updateDiary = async (
  id: string,
  diary: Diary,
  files: Express.Multer.File[] | undefined
) => {
  try {
    if (files != undefined) {
      const uploadCompleteFiles = await AWSUtils.uploadFileToS3({
        s3Path: "eom/diary/",
        file: files,
      });

      matchFileNames(diary, uploadCompleteFiles);
    }
    const oldDiary = await diaryRepository.getDiary(id);
    if (oldDiary == null) {
      throw { status: 400, message: "값이 존재하지 않습니다." };
    }
    // 삭제 파일 filter
    // 기존 oldDiary에서 diary(newDiary)에 없는 파일들을 삭제할 파일로 지정
    const deleteImgs = oldDiary.imgs.filter((e) => !diary.imgs.includes(e));
    const deleteVids = oldDiary.vids.filter((e) => !diary.vids.includes(e));

    // 삭제할 파일들을 s3에서 삭제
    AWSUtils.deleteFileFromS3({
      files: deleteImgs.concat(deleteVids),
    });

    // throw { status: 400, message: "값이 존재하지 않습니다." };

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

// 파일 이름 매칭 시켜주기
const matchFileNames = (diary: Diary, files: Express.Multer.File[]) => {
  for (var i = 0; i < files.length; i++) {
    const filename = files[i].filename;
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
};

const classifyDeleteFiles = (newValue: Diary, oldValue: Diary) => {
  // 새로운 값에 없는 파일들을 찾아서 삭제
};
