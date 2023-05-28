import {
  Diary,
  DiaryDetail,
  IDiary,
  IDiaryDetail,
} from "../models/diary_model";

export const createDiaryRepository = async (
  diary: IDiary,
  diaryDetial: IDiaryDetail
) => {
  try {
    // 스키마를 이용한 인스턴스화
    const diaryInstance = new Diary(diary);
    // save 하기
    const savedDiary = await diaryInstance.save();
    // diaryDetail에 diaryId를 넣어주기
    diaryDetial.diaryId = savedDiary.id;
    // 스키마를 이용한 인스턴스화
    const diaryDetailInstance = new DiaryDetail(diaryDetial);
    // diaryDetail을 save 하기
    const savedDiaryDetail = await diaryDetailInstance.save();
    return { diary: savedDiary, diaryDetail: savedDiaryDetail };
  } catch {
    throw { status: 400, message: "값이 존재하지 않습니다." };
  }
};

export const getDiaryRepository = async () => {
  try {
    const diarys = await Diary.find({});
    return diarys;
  } catch {
    throw { status: 400, message: "값이 존재하지 않습니다." };
  }
};
