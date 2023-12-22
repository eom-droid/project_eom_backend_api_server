import { ObjectId, Schema, model } from "mongoose";

/**
 * 다이어리 모델
 */

export interface IDiaryReply {
  // user : 작성자 ID
  userId: string;
  // commentId : 댓글 ID
  commentId: string;
  // content : 답변 내용
  content: string;
  // like : 좋아요 수
  like: Array<ObjectId>;
}
export class DiaryReply {
  // user : 작성자 ID
  userId: string;
  // commentId : 댓글 ID
  commentId: string;
  // content : 답글 내용
  content: string;
  // like : 좋아요 수
  like: Array<ObjectId>;

  constructor({ commentId, userId, content, like }: IDiaryReply) {
    this.commentId = commentId;
    this.userId = userId;
    this.content = content;
    this.like = like;
  }
  toDiaryModel() {
    return new DiaryReply({
      commentId: this.commentId,
      userId: this.userId,
      content: this.content,
      like: this.like,
    });
  }

  toJson() {
    return {
      commentId: this.commentId,
      userId: this.userId,
      content: this.content,
      like: this.like,
    };
  }
  static fromJson(json: any) {
    return new DiaryReply({
      commentId: json.commentId,
      userId: json.userId,
      content: json.content,
      like: json.like,
    });
  }
}
const DiaryReplySchema = new Schema(
  {
    // user : 작성자 ID
    userId: {
      type: String,
      required: true,
      ref: "user",
    },
    // comment : 댓글 ID
    commentId: {
      type: String,
      required: true,
      ref: "diary",
    },
    // content : 답글 내용
    content: {
      type: String,
      required: true,
    },
    // like : 좋아요 수
    like: {
      type: Array<ObjectId>,
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

export const DiaryReplyModel = model("diaryReply", DiaryReplySchema);
