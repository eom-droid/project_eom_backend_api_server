import { InferSchemaType, Schema, model } from "mongoose";

/**
 * 다이어리 모델
 */

const DiaryCommentSchema = new Schema(
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
    // content : 댓글 내용
    content: {
      type: String,
      required: true,
    },
    // isDeleted : 삭제 여부
    isDeleted: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

export type DiaryComment = InferSchemaType<typeof DiaryCommentSchema>;

export const DiaryCommentModel = model("diaryComment", DiaryCommentSchema);
