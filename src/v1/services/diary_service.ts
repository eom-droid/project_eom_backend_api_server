import {
  Diary,
  DiaryDetail,
  IDiary,
  IDiaryDetail,
} from "../models/diary_model";

import { createDiaryRepository } from "../repositorys/diary_repository";

export const createDiaryService = async (
  diary: Object,
  files: Express.Multer.File[] | undefined
) => {
  try {
    var diaryObj = diary as IDiary;
    var diaryDetailObj = diary as IDiaryDetail;

    // 파일 이름 매칭 시켜주기
    if (files != undefined) {
      for (var i = 0; i < files.length; i++) {
        //@ts-ignore
        const filename = files[i].key;
        const originalname = files[i].originalname;
        const imgFoundIndex = diaryDetailObj.imgs.findIndex(
          (e) => e === originalname
        );
        if (imgFoundIndex !== -1) {
          diaryDetailObj.imgs[imgFoundIndex] = filename;
          continue;
        }

        const vidFoundIndex = diaryDetailObj.vids.findIndex(
          (e) => e === originalname
        );
        if (vidFoundIndex !== -1) {
          diaryDetailObj.vids[vidFoundIndex] = filename;
          continue;
        }
      }
    }
    await createDiaryRepository(diaryObj, diaryDetailObj);
  } catch (error: any) {
    throw { status: error?.status || 400, message: error?.message || error };
  }
};
