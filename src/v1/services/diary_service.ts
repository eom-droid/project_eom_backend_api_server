import {
  Diary,
  DiaryDetail,
  IDiary,
  IDiaryDetail,
} from "../models/diary_model";

import {
  createDiaryRepository,
  getDiaryRepository,
} from "../repositorys/diary_repository";

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

        // file 중에 thumbnail 값이 일치하다면 diaryObj.thumbnail에 넣어주기
        if (diaryObj.thumbnail === originalname) {
          diaryObj.thumbnail = filename;
        }

        // file 중에 img 값이 일치하다면 diaryDetailObj.imgs에 넣어주기
        const imgFoundIndex = diaryDetailObj.imgs.findIndex(
          (e) => e === originalname
        );
        if (imgFoundIndex !== -1) {
          diaryDetailObj.imgs[imgFoundIndex] = filename;
          continue;
        }

        // file 중에 vid 값이 일치하다면 diaryDetailObj.vids에 넣어주기
        const vidFoundIndex = diaryDetailObj.vids.findIndex(
          (e) => e === originalname
        );
        if (vidFoundIndex !== -1) {
          diaryDetailObj.vids[vidFoundIndex] = filename;
          continue;
        }
      }
    }
    return await createDiaryRepository(diaryObj, diaryDetailObj);
  } catch (error: any) {
    throw { status: error?.status || 400, message: error?.message || error };
  }
};

export const getDiaryService = async () => {
  try {
    return await getDiaryRepository();
  } catch (error: any) {
    throw { status: error?.status || 400, message: error?.message || error };
  }
};
