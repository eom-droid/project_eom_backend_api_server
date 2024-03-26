import { InferSchemaType, Schema, model } from "mongoose";
import { CustomHttpErrorModel } from "../../models/custom_http_error_model";
import { MUSIC } from "../../constant/default";

/**
 * 음악 모델
 */
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

export type Music = InferSchemaType<typeof MusicSchema>;

export const MusicModel = model(MUSIC, MusicSchema);

// 추후 middleware화 예정
export const jsonToMusic = (json: any) => {
  try {
    const result = new MusicModel({
      title: json.title as string,
      artiste: json.artiste as string,
      review: json.review as string,
      albumCover: json.albumCover as string,
      youtubeMusicId: json.youtubeMusicId as string,
      spotifyId: json.spotifyId as string,
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

export const musicToJson = (music: Music) => {
  return {
    title: music.title,
    artiste: music.artiste,
    review: music.review,
    albumCover: music.albumCover,
    youtubeMusicId: music.youtubeMusicId,
    spotifyId: music.spotifyId,
  };
};
