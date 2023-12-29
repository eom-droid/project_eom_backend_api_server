import { InferSchemaType, Schema, model } from "mongoose";

/**
 * 다이어리 좋아요 모델
 */
const DiaryCommentLikeSchema = new Schema({
  // user : 작성자 ID
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  // diary : 다이어리 ID
  commentId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "diaryComment",
  },
});

export type DiaryCommentLike = InferSchemaType<typeof DiaryCommentLikeSchema>;

export const DiaryCommentLikeModel = model(
  "diaryCommentLike",
  DiaryCommentLikeSchema
);
