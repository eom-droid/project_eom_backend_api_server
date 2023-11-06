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
  // isVerified : 인증 여부
  isVerified: boolean;
}

export class EmailVerify {
  // email : 이메일
  email: string;
  // verificationCode : 인증 코드
  verificationCode: string;
  // isVerified : 인증 여부
  isVerified: boolean;
  constructor({ email, verificationCode, isVerified }: IEmailVerify) {
    this.email = email;
    this.verificationCode = verificationCode;
    this.isVerified = isVerified;
  }

  toJson() {
    return {
      email: this.email,
      verificationCode: this.verificationCode,
      isVerified: this.isVerified,
    };
  }
  static fromJson(json: any): IEmailVerify {
    return new EmailVerify({
      email: json.email,
      verificationCode: json.verificationCode,
      isVerified: json.isVerified,
    });
  }
  toEmailVerifyModel() {
    return new EmailVerifyModel({
      email: this.email,
      verificationCode: this.verificationCode,
      isVerified: this.isVerified,
    });
  }
}

const EmailVerifySchema = new Schema(
  {
    email: { type: String, required: true },
    verificationCode: { type: String, required: true },
    isVerified: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export const EmailVerifyModel = model("EmailVerify", EmailVerifySchema);
