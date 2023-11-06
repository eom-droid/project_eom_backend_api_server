import { Schema, model } from "mongoose";
import { ProviderType } from "../../constant/default";

/**
 * 유저 모델
 */

export interface IUser {
  // email : 이메일
  email: string | undefined;
  // password : 비밀번호
  password: string | undefined;
  // nick : 닉네임
  nick: string;
  // birthday : 생일
  birthday: Date | undefined;
  // profileImg : 프로필 이미지
  profileImg: string | undefined;
  // snsId : sns 아이디
  snsId: string | undefined;
  // provider : 제공자
  provider: ProviderType | undefined;
}

export class User {
  // email : 이메일
  email: string | undefined;
  // password : 비밀번호
  password: string | undefined;
  // nick : 닉네임
  nick: string;
  // birthday : 생일
  birthday: Date | undefined;
  // profileImg : 프로필 이미지
  profileImg: string | undefined;
  // snsId : sns 아이디
  snsId: string | undefined;
  // provider : 제공자
  provider: ProviderType | undefined;

  constructor({
    email,
    password,
    nick,
    birthday,
    profileImg,
    snsId,
    provider,
  }: IUser) {
    this.email = email;
    this.password = password;
    this.nick = nick;
    this.birthday = birthday;
    this.profileImg = profileImg;
    this.snsId = snsId;
    this.provider = provider;
  }

  toJson() {
    return {
      email: this.email,
      password: this.password,
      nick: this.nick,
      birthday: this.birthday,
      profileImg: this.profileImg,
      snsId: this.snsId,
      provider: this.provider,
    };
  }
  static fromJson(json: any): User {
    return new User({
      email: json.email ?? undefined,
      password: json.password ?? undefined,
      nick: json.nick,
      birthday: json.birthday ?? undefined,
      profileImg: json.profileImg ?? undefined,
      snsId: json.snsId ?? undefined,
      provider: json.provider ?? undefined,
    });
  }
  toUserModel() {
    return new UserModel({
      email: this.email,
      password: this.password,
      nick: this.nick,
      birthday: this.birthday,
      profileImg: this.profileImg,
      snsId: this.snsId,
      provider: this.provider,
    });
  }
}

const UserSchema = new Schema(
  {
    email: { type: String, required: false },
    password: { type: String, required: false },
    nick: { type: String, required: true },
    birthday: { type: Date, required: false },
    profileImg: { type: String, required: false },
    snsId: { type: String, required: false },
    provider: { type: String, required: false },
  },
  { timestamps: true }
);

export const UserModel = model("User", UserSchema);
