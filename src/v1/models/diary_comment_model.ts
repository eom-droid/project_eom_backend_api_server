import { Schema, model } from "mongoose";

/**
 * 다이어리 모델
 */

export interface IDiaryComment {
  // user : 작성자 ID
  userId: string;
  // diary : 다이어리 ID
  diaryId: string;
  // content : 댓글 내용
  content: string;
  // like : 좋아요 수
  like: number;
}
export class DiaryComment {
  // userId : 작성자
  userId: string;
  // diaryId : 다이어리
  diaryId: string;
  // content : 댓글 내용
  content: string;
  // like : 좋아요 수
  like: number;

  constructor({ diaryId, userId, content, like }: IDiaryComment) {
    this.diaryId = diaryId;
    this.userId = userId;
    this.content = content;
    this.like = like;
  }
  toDiaryModel() {
    return new DiaryComment({
      diaryId: this.diaryId,
      userId: this.userId,
      content: this.content,
      like: this.like,
    });
  }

  toJson() {
    return {
      diaryId: this.diaryId,
      userId: this.userId,
      content: this.content,
      like: this.like,
    };
  }
  static fromJson(json: any) {
    return new DiaryComment({
      diaryId: json.diaryId,
      userId: json.userId,
      content: json.content,
      like: json.like,
    });
  }
}
const DiaryCommentSchema = new Schema(
  {
    // user : 작성자 ID
    userId: {
      type: String,
      required: true,
      ref: "user",
    },
    // diary : 다이어리 ID
    diaryId: {
      type: String,
      required: true,
      ref: "diary",
    },
    // content : 댓글 내용
    content: {
      type: String,
      required: true,
    },
    // like : 좋아요 수
    like: {
      type: Number,
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

export const DiaryCommentModel = model("diaryComment", DiaryCommentSchema);
