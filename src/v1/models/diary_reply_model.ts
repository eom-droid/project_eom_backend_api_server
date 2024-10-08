import { InferSchemaType, Schema, model } from "mongoose";

const DiaryReplySchema = new Schema(
  {
    // user : 작성자 ID
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    // comment : 댓글 ID
    commentId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "diary",
    },
    // content : 답글 내용
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

export type DiaryReply = InferSchemaType<typeof DiaryReplySchema>;

export const DiaryReplyModel = model("diaryReply", DiaryReplySchema);
