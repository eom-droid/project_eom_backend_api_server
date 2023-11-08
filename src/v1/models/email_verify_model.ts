import { Schema, model } from "mongoose";
import { ProviderType } from "../../constant/default";

/**
 * 유저 모델
 */

export interface IEmailVerify {
  // email : 이메일
  email: string;
  // verificationCode : 인증 코드
  verificationCode: string;
}

export class EmailVerify {
  // email : 이메일
  email: string;
  // verificationCode : 인증 코드
  verificationCode: string;
  constructor({ email, verificationCode }: IEmailVerify) {
    this.email = email;
    this.verificationCode = verificationCode;
  }

  toJson() {
    return {
      email: this.email,
      verificationCode: this.verificationCode,
    };
  }
  static fromJson(json: any): IEmailVerify {
    return new EmailVerify({
      email: json.email,
      verificationCode: json.verificationCode,
    });
  }
  toEmailVerifyModel() {
    return new EmailVerifyModel({
      email: this.email,
      verificationCode: this.verificationCode,
    });
  }
}

const EmailVerifySchema = new Schema(
  {
    email: { type: String, required: true },
    verificationCode: { type: String, required: true },
  },
  { timestamps: true }
);

export const EmailVerifyModel = model("EmailVerify", EmailVerifySchema);
