import { Schema, model } from "mongoose";
import { CustomHttpErrorModel } from "../../models/custom_http_error_model";

/**
 * 다이어리 모델
 */

export interface IMusic {
  // title : 노래제목
  title: string;
  // artiste : 아티스트
  artiste: string;
  // review : 한줄평
  review: string;
  // albumCover : 앨범커버
  albumCover: string;
  // youtubeLink : 유튜브 링크
  youtubeLink: string;
}
export class Music {
  // title : 노래제목
  title: string;
  // artiste : 아티스트
  artiste: string;
  // review : 한줄평
  review: string;
  // albumCover : 앨범커버
  albumCover: string;
  // youtubeLink : 유튜브 링크
  youtubeLink: string;

  constructor({
    title,
    artiste,
    review,
    albumCover,
    youtubeLink,
  }: {
    title: string;
    artiste: string;
    review: string;
    albumCover: string;
    youtubeLink: string;
  }) {
    this.title = title;
    this.artiste = artiste;
    this.review = review;
    this.albumCover = albumCover;
    this.youtubeLink = youtubeLink;
  }
  toJson() {
    return {
      title: this.title,
      artiste: this.artiste,
      review: this.review,
      albumCover: this.albumCover,
      youtubeLink: this.youtubeLink,
    };
  }
  static fromJson(json: any): Music {
    return new Music({
      title: json.title,
      artiste: json.artiste,
      review: json.review,
      albumCover: json.albumCover,
      youtubeLink: json.youtubeLink,
    });
  }

  toMusicModel() {
    return new MusicModel({
      title: this.title,
      artiste: this.artiste,
      review: this.review,
      albumCover: this.albumCover,
      youtubeLink: this.youtubeLink,
    });
  }
}

const MusicSchema = new Schema(
  {
    title: { type: String, required: true },
    artiste: { type: String, required: true },
    review: { type: String, required: true },
    albumCover: { type: String, required: true },
    youtubeLink: { type: String, required: true },
  },
  { timestamps: true }
);

export const MusicModel = model("music", MusicSchema);

// 추후 middleware화 예정
export const reqToMusic = (json: any): Music => {
  try {
    const result = new Music({
      title: json.title as string,
      artiste: json.artiste as string,
      review: json.review as string,
      albumCover: json.albumCover as string,
      youtubeLink: json.youtubeLink as string,
    });

    return result;
  } catch (e) {
    throw new CustomHttpErrorModel({
      message: "입력값이 유효하지 않습니다.",
      status: 400,
    });
  }
};
