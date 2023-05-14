import { timeStamp } from "console";
import { Schema, model, Types } from "mongoose";

/**
 * 다이어리 모델
 */
const DiarySchema = new Schema(
  {
    // title : 제목
    title: { type: String, required: true },
    // writer : 작성자
    writer: { type: String, required: true },
    // weather : 날씨
    weather: { type: String, required: true },
    // hashtags : 해시태그 리스트
    hashtags: { type: Array, required: true },
    // postDate : 표출 일자 -> 다이어리의 표출 일자, 사용자는 해당 값으로 ordering을 진행할 예정
    postDate: { type: Date, required: true },
    // thumnail : 썸네일 -> S3에 저장된 이미지, vid 의 경로
    thumnail: { type: String, required: true },
    // category : 카테고리 -> 카테고리를 통해서 다이어리 리스트 페이지에서 필터링을 진행할 예정
    category: { type: String, required: true },
    // isShown : 표출 여부
    isShown: { type: Boolean, required: true },
  },
  { timestamps: true }
);

DiarySchema.index({ postDate: 1 });

export const Diary = model("diary", DiarySchema);

/**
 * 다이어리 상세 모델
 */

const DiaryDetailSchema = new Schema(
  {
    // diary : 다이어리 ID
    diaryId: { type: Types.ObjectId, required: true, ref: "diary" },
    // txts : 텍스트 리스트
    txts: { type: Array<String>, required: true },
    // imgs : 이미지 리스트
    imgs: { type: Array<String>, required: true },
    // vids : 비디오 리스트 -> 초기에는 직접 로딩하지 않고
    vids: { type: Array<String>, required: true },
    // contentOrder : 컨텐츠 순서
    // 추후 markdown 형식으로 저장할 예정
    // 현재는 위 3가지 txt,img,vid의 표출 순서를 정의
    contentOrder: { type: Array<String>, required: true },
  },
  { timestamps: true }
);

export const DiaryDetail = model("diaryDetail", DiaryDetailSchema);
