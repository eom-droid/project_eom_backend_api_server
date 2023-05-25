import { timeStamp } from "console";
import { Schema, model, Types } from "mongoose";

export interface IDiary {
  // title : 제목
  title: String;
  // writer : 작성자
  writer: String;
  // weather : 날씨
  weather: String;
  // hashtags : 해시태그 리스트
  hashtags: Array<String>;
  // postDate : 표출 일자 -> 다이어리의 표출 일자, 사용자는 해당 값으로 ordering을 진행할 예정
  postDate: Date;
  // thumbnail : 썸네일 -> S3에 저장된 이미지, vid 의 경로
  thumbnail: String;
  // category : 카테고리 -> 카테고리를 통해서 다이어리 리스트 페이지에서 필터링을 진행할 예정
  category: String;
  // isShown : 표출 여부
  isShown: Boolean;
}
/**
 * 다이어리 모델
 */
const DiarySchema = new Schema<IDiary>(
  {
    // title : 제목
    title: { type: String, required: true },
    // writer : 작성자
    writer: { type: String, required: true },
    // weather : 날씨
    weather: { type: String, required: true },
    // hashtags : 해시태그 리스트
    hashtags: [{ type: String, required: true }],
    // postDate : 표출 일자 -> 다이어리의 표출 일자, 사용자는 해당 값으로 ordering을 진행할 예정
    postDate: { type: Date, required: true },
    // thumbnail : 썸네일 -> S3에 저장된 이미지, vid 의 경로
    thumbnail: { type: String, required: false },
    // category : 카테고리 -> 카테고리를 통해서 다이어리 리스트 페이지에서 필터링을 진행할 예정
    category: { type: String, required: true },
    // isShown : 표출 여부
    isShown: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export const Diary = model<IDiary>("diary", DiarySchema);
DiarySchema.index({ postDate: 1 });

/**
 * 다이어리 상세 모델
 */

export interface IDiaryDetail {
  // diary : 다이어리 ID
  diaryId: String;
  // txts : 텍스트 리스트
  txts: Array<String>;
  // imgs : 이미지 리스트
  imgs: Array<String>;
  // vids : 비디오 리스트 -> 초기에는 직접 로딩하지 않고
  vids: Array<String>;
  // contentOrder : 컨텐츠 순서
  contentOrder: Array<String>;
}
const DiaryDetailSchema = new Schema<IDiaryDetail>(
  {
    // diary : 다이어리 ID
    diaryId: { type: Types.ObjectId, required: true, ref: "diary" },
    // txts : 텍스트 리스트
    txts: [{ type: String, required: true }],
    // imgs : 이미지 리스트
    imgs: [{ type: String, required: true }],
    // vids : 비디오 리스트 -> 초기에는 직접 로딩하지 않고
    vids: [{ type: String, required: true }],
    // contentOrder : 컨텐츠 순서
    // 추후 markdown 형식으로 저장할 예정
    // 현재는 위 3가지 txt,img,vid의 표출 순서를 정의
    contentOrder: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export const DiaryDetail = model<IDiaryDetail>(
  "diaryDetail",
  DiaryDetailSchema
);
