import { InferSchemaType, Schema, model } from "mongoose";

/**
 * 다이어리 좋아요 모델
 */
const DiaryLikeSchema = new Schema(
  {
    // user : 작성자 ID
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    // diary : 다이어리 ID
    diaryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "diary",
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

export type DiaryLike = InferSchemaType<typeof DiaryLikeSchema>;

export const DiaryLikeModel = model("diaryLike", DiaryLikeSchema);
