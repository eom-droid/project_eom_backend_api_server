import { Schema, model, Types, InferSchemaType } from "mongoose";
import { CustomHttpErrorModel } from "../../models/custom_http_error_model";
import { Request } from "express";

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
  // 아래 postDateInd와 같이 사용하지 않는 이유는 나중에 표출 일자 및 시간대를 같이 출력할 수 있기 때문
  postDT: Date;
  // postDateInd : 표출일자와 동일한 날짜의 다이어리들의 인덱스

  // createIndex를 통해서 자동으로 생성
  postDateInd: number;
  // thumbnail : 썸네일 -> S3에 저장된 이미지, vid 의 경로
  thumbnail: string | null;
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
  // 아래 postDateInd와 같이 사용하지 않는 이유는 나중에 표출 일자 및 시간대를 같이 출력할 수 있기 때문
  postDT: Date;
  // postDateInd : 표출일자와 동일한 날짜의 다이어리들의 인덱스
  // createIndex를 통해서 자동으로 생성
  postDateInd: number;
  // thumbnail : 썸네일 -> S3에 저장된 이미지, vid 의 경로
  thumbnail: string | null;
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
    postDateInd,
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
    this.postDateInd = postDateInd;
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
      postDateInd: this.postDateInd,
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
      postDateInd: this.postDateInd,
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
      postDateInd: json.postDateInd as number,
      thumbnail: json.thumbnail ? (json.thumbnail as string) : null,
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

export const DiaryModel = model("diary", DiarySchema);

// 추후 middleware화 예정
export const reqToDiary = (req: Request): Diary => {
  try {
    const json = JSON.parse(req.body.diary);

    const result = new Diary({
      title: json.title as string,
      writer: json.writer as string,
      weather: json.weather as string,
      hashtags: json.hashtags as string[],
      postDT: new Date(json.postDT),
      postDateInd: json.postDateInd as number,
      thumbnail: json.thumbnail ? (json.thumbnail as string) : null,
      category: json.category as string,
      isShown: json.isShown as boolean,
      txts: json.txts as string[],
      imgs: json.imgs as string[],
      vids: json.vids as string[],
      contentOrder: json.contentOrder as string[],
    });
    return result;
  } catch (e) {
    throw new CustomHttpErrorModel({
      message: "입력값이 유효하지 않습니다.",
      status: 400,
    });
  }
};
