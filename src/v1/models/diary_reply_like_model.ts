import { InferSchemaType, Schema, model } from "mongoose";

/**
 * 다이어리 좋아요 모델
 */
const DiaryReplyLikeSchema = new Schema({
  // user : 작성자 ID
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  // diary : 다이어리 ID
  replyId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "diaryReply",
  },
});

export type DiaryReplyLike = InferSchemaType<typeof DiaryReplyLikeSchema>;

export const DiaryReplyLikeModel = model(
  "diaryReplyLike",
  DiaryReplyLikeSchema
);
