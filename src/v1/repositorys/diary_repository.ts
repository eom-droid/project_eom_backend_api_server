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

    // diaryDetail save하는 것 추가작업 필요
  } catch {
    throw { status: 400, message: "값이 존재하지 않습니다." };
  }
};
