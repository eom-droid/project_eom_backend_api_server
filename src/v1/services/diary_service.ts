import { DiaryPaginateReqModel } from "../../models/diary_paginate_req_model";
import { PaginateReturnModel } from "../../models/paginate_res_model";
import { Diary, IDiary } from "../models/diary_model";

import * as diaryRepository from "../repositorys/diary_repository";
import { AWSUtils } from "../../utils/aws_utils";

/**
 * @DESC create new diary
 * 새로운 diary를 생성함 파일과 함께 전송될 경우 해당 파일을 저장함
 * 파일 업로드와 이름 매칭을 진행함
 * @RETURN diary
 */
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

      matchFileNames(
        diary,
        uploadCompleteFiles instanceof Array
          ? uploadCompleteFiles
          : [uploadCompleteFiles]
      );
    }

    return await diaryRepository.createDiary(diary);
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC update diary
 * diary를 patch함 파일과 함께 전송될 경우 해당 파일을 저장함
 * 파일 업로드와 이름 매칭을 진행함
 * 기존 파일중에서 삭제된 파일이 있다면 s3에서 삭제함
 * @RETURN diary
 */
export const updateDiary = async (
  id: string,
  diary: Diary,
  files: Express.Multer.File[] | undefined
) => {
  try {
    const oldDiary = await diaryRepository.getDiary(id);
    if (oldDiary == null) {
      throw { status: 400, message: "값이 존재하지 않습니다." };
    }

    // 삭제 파일 filter
    // 기존 oldDiary에서 diary(newDiary)에 없는 파일들을 삭제할 파일로 지정
    const deleteImgs = oldDiary.imgs.filter((e) => !diary.imgs.includes(e));
    const deleteVids = oldDiary.vids.filter((e) => !diary.vids.includes(e));

    // 삭제할 파일들을 s3에서 삭제
    await AWSUtils.deleteFileFromS3({
      files: deleteImgs.concat(deleteVids),
    });

    if (files != undefined) {
      const uploadCompleteFiles = await AWSUtils.uploadFileToS3({
        s3Path: "eom/diary/",
        file: files,
      });

      matchFileNames(
        diary,
        uploadCompleteFiles instanceof Array
          ? uploadCompleteFiles
          : [uploadCompleteFiles]
      );
    }

    return await diaryRepository.updateDiary(id, diary);
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC get diaries
 * pagination을 통해 특정 갯수만큼의 diary를 가져옴
 */
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

/**
 * @DESC get diary detail
 * 파라미터에 존재하는 id를 통해 특정 diary의 모든 정보를 가져옴
 */
export const getDiary = async (diaryId: string): Promise<Diary> => {
  const result = await diaryRepository.getDiary(diaryId);
  if (result == null) {
    throw { status: 400, message: "값이 존재하지 않습니다." };
  } else {
    return result;
  }
};

/**
 * @DESC delete diary
 * diary를 삭제함
 * diary에 있는 thumbnail, imgs, vids를 s3에서 삭제함
 */
export const deleteDiary = async (diaryId: string): Promise<void> => {
  // 원래 findOneAndDelete를 진행해도 됨
  // 더빠를듯
  // 안정적으로 진행하기 위해서 이렇게 함
  const result = await diaryRepository.getDiary(diaryId);

  if (result != null) {
    const deletingFiles = result.imgs.concat(result.vids);

    await Promise.all(
      deletingFiles.map((e) => {
        AWSUtils.deleteFileFromS3({
          files: [e],
        });
      })
    );
    await diaryRepository.deleteDiary(diaryId);
  }
  return;
};

/**
 * @DESC match file names
 * diary에 있는 thumbnail, imgs, vids와 files에 있는 originalname을 비교해서
 * 일치하는 값이 있다면 해당 값에 맞는 filename으로 바꿔줌
 */
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
