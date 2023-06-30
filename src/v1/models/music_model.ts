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
  // youtubeMusicId : 유투브 뮤직 아이디
  youtubeMusicId: string;
  // spotify Id : 스포티파이 아이디
  spotifyId: string;
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
  // youtubeMusicId : 유투브 뮤직 아이디
  youtubeMusicId: string;
  // spotify Id : 스포티파이 아이디
  spotifyId: string;

  constructor({
    title,
    artiste,
    review,
    albumCover,
    youtubeMusicId,
    spotifyId,
  }: IMusic) {
    this.title = title;
    this.artiste = artiste;
    this.review = review;
    this.albumCover = albumCover;
    this.youtubeMusicId = youtubeMusicId;
    this.spotifyId = spotifyId;
  }
  toJson() {
    return {
      title: this.title,
      artiste: this.artiste,
      review: this.review,
      albumCover: this.albumCover,
      youtubeMusicId: this.youtubeMusicId,
      spotifyId: this.spotifyId,
    };
  }
  static fromJson(json: any): Music {
    return new Music({
      title: json.title,
      artiste: json.artiste,
      review: json.review,
      albumCover: json.albumCover,
      youtubeMusicId: json.youtubeMusicId,
      spotifyId: json.spotifyId,
    });
  }

  toMusicModel() {
    return new MusicModel({
      title: this.title,
      artiste: this.artiste,
      review: this.review,
      albumCover: this.albumCover,
      youtubeMusicId: this.youtubeMusicId,
      spotifyId: this.spotifyId,
    });
  }
}

const MusicSchema = new Schema(
  {
    title: { type: String, required: true },
    artiste: { type: String, required: true },
    review: { type: String, required: true },
    albumCover: { type: String, required: true },
    youtubeMusicId: { type: String, required: true },
    spotifyId: { type: String, required: true },
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
      youtubeMusicId: json.youtubeMusicId as string,
      spotifyId: json.spotifyId as string,
    });

    return result;
  } catch (e) {
    throw new CustomHttpErrorModel({
      message: "입력값이 유효하지 않습니다.",
      status: 400,
    });
  }
};
