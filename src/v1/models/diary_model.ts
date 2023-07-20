import { Schema, model } from "mongoose";
import { CustomHttpErrorModel } from "../../models/custom_http_error_model";

/**
 * 다이어리 모델
 */

export interface IDiary {
  // title : 제목
  title: string;
  // writer : 작성자
  writer: string;
  // weather : 날씨
  weather: string;
  // hashtags : 해시태그 리스트
  hashtags: string[];
  // postDT : 표출 일자 -> 다이어리의 표출 일자, 사용자는 해당 값으로 ordering을 진행할 예정
  postDT: Date;
  // thumbnail : 썸네일 -> S3에 저장된 이미지, vid 의 경로
  thumbnail: string;
  // category : 카테고리 -> 카테고리를 통해서 다이어리 리스트 페이지에서 필터링을 진행할 예정
  category: string;
  // isShown : 표출 여부
  isShown: boolean;
  // txts : 텍스트 리스트
  txts: string[];
  // imgs : 이미지 리스트
  imgs: string[];
  // vids : 비디오 리스트 -> 초기에는 직접 로딩하지 않고
  vids: string[];
  // contentOrder : 컨텐츠 순서
  // 추후 markdown 형식으로 저장할 예정
  // 현재는 위 3가지 txt,img,vid의 표출 순서를 정의
  contentOrder: string[];
}
export class Diary {
  // title : 제목
  title: string;
  // writer : 작성자
  writer: string;
  // weather : 날씨
  weather: string;
  // hashtags : 해시태그 리스트
  hashtags: string[];
  // postDT : 표출 일자 -> 다이어리의 표출 일자, 사용자는 해당 값으로 ordering을 진행할 예정
  postDT: Date;
  // thumbnail : 썸네일 -> S3에 저장된 이미지, vid 의 경로
  thumbnail: string;
  // category : 카테고리 -> 카테고리를 통해서 다이어리 리스트 페이지에서 필터링을 진행할 예정
  category: string;
  // isShown : 표출 여부
  isShown: boolean;
  // txts : 텍스트 리스트
  txts: string[];
  // imgs : 이미지 리스트
  imgs: string[];
  // vids : 비디오 리스트 -> 초기에는 직접 로딩하지 않고
  vids: string[];
  // contentOrder : 컨텐츠 순서
  // 추후 markdown 형식으로 저장할 예정
  // 현재는 위 3가지 txt,img,vid의 표출 순서를 정의
  contentOrder: string[];

  constructor({
    title,
    writer,
    weather,
    hashtags,
    postDT,
    thumbnail,
    category,
    isShown,
    txts,
    imgs,
    vids,
    contentOrder,
  }: IDiary) {
    this.title = title;
    this.writer = writer;
    this.weather = weather;
    this.hashtags = hashtags;
    this.postDT = postDT;
    this.thumbnail = thumbnail;
    this.category = category;
    this.isShown = isShown;
    this.txts = txts;
    this.imgs = imgs;
    this.vids = vids;
    this.contentOrder = contentOrder;
  }
  toDiaryModel() {
    return new DiaryModel({
      title: this.title,
      writer: this.writer,
      weather: this.weather,
      hashtags: this.hashtags,
      postDT: this.postDT,
      thumbnail: this.thumbnail,
      category: this.category,
      isShown: this.isShown,
      txts: this.txts,
      imgs: this.imgs,
      vids: this.vids,
      contentOrder: this.contentOrder,
    });
  }

  toJson() {
    return {
      title: this.title,
      writer: this.writer,
      weather: this.weather,
      hashtags: this.hashtags,
      postDT: this.postDT,
      thumbnail: this.thumbnail,
      category: this.category,
      isShown: this.isShown,
      txts: this.txts,
      imgs: this.imgs,
      vids: this.vids,
      contentOrder: this.contentOrder,
    };
  }
  static fromJson(json: any) {
    return new Diary({
      title: json.title as string,
      writer: json.writer as string,
      weather: json.weather as string,
      hashtags: json.hashtags as string[],
      postDT: new Date(json.postDT),
      thumbnail: json.thumbnail as string,
      category: json.category as string,
      isShown: json.isShown as boolean,
      txts: json.txts as string[],
      imgs: json.imgs as string[],
      vids: json.vids as string[],
      contentOrder: json.contentOrder as string[],
    });
  }
}
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
    postDT: { type: Date, required: true },
    // thumbnail : 썸네일 -> S3에 저장된 이미지, vid 의 경로
    thumbnail: { type: String, required: true },
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

export const DiaryModel = model("diary", DiarySchema);

// 추후 middleware화 예정
export const reqToDiary = (json: any): Diary => {
  try {
    const result = new Diary({
      title: json.title as string,
      writer: json.writer as string,
      weather: json.weather as string,
      hashtags: json.hashtags as string[],
      postDT: new Date(json.postDT),
      thumbnail: json.thumbnail as string,
      category: json.category as string,
      isShown: json.isShown as boolean,
      txts: json.txts as string[],
      imgs: json.imgs as string[],
      vids: json.vids as string[],
      contentOrder: json.contentOrder as string[],
    });

    return result;
  } catch (error) {
    console.log(new Date().toISOString() + ": npm log: " + error);

    throw new CustomHttpErrorModel({
      message: "입력값이 유효하지 않습니다.",
      status: 400,
    });
  }
};
