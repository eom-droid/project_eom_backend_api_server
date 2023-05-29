import { Schema, model, Types, InferSchemaType } from "mongoose";
import { CustomHttpErrorModel } from "../../models/custom_http_error_model";
import { Request } from "express";

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
    hashtags: [{ type: String, required: true }],
    // postDT : 표출 일자 -> 다이어리의 표출 일자, 사용자는 해당 값으로 ordering을 진행할 예정
    // 아래 postDateInd와 같이 사용하지 않는 이유는 나중에 표출 일자 및 시간대를 같이 출력할 수 있기 때문
    postDT: { type: Date, required: true },
    // postDateInd : 표출일자와 동일한 날짜의 다이어리들의 인덱스
    // createIndex를 통해서 자동으로 생성
    postDateInd: { type: Number, required: true },
    // thumbnail : 썸네일 -> S3에 저장된 이미지, vid 의 경로
    thumbnail: { type: String, required: false },
    // category : 카테고리 -> 카테고리를 통해서 다이어리 리스트 페이지에서 필터링을 진행할 예정
    category: { type: String, required: true },
    // isShown : 표출 여부
    isShown: { type: Boolean, required: true },
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
export type Diary = InferSchemaType<typeof DiarySchema>;
export const DiaryModel = model("diary", DiarySchema);

// 추후 middleware화 예정
export const reqToDiary = (req: Request) => {
  try {
    const json = JSON.parse(req.body.diary);

    const result = {
      title: json.title,
      writer: json.writer,
      weather: json.weather,
      hashtags: json.hashtags,
      postDT: new Date(json.postDT),
      postDateInd: json.postDateInd,
      thumbnail: json.thumbnail,
      category: json.category,
      isShown: json.isShown,
      txts: json.txts,
      imgs: json.imgs,
      vids: json.vids,
      contentOrder: json.contentOrder,
    } as Diary;
    return result;
  } catch (e) {
    throw new CustomHttpErrorModel({
      message: "입력값이 유효하지 않습니다.",
      status: 400,
    });
  }
};
