import { Schema, model } from "mongoose";
import { ProviderType, RoleType } from "../../constant/default";

/**
 * 유저 모델
 */

export interface IUser {
  // email : 이메일
  email: string | undefined;
  // password : 비밀번호
  password: string | undefined;
  // nickName : 닉네임
  nickName: string;
  // birthday : 생일
  birthday: Date | undefined;
  // profileImg : 프로필 이미지
  profileImg: string | undefined;
  // snsId : sns 아이디
  snsId: string | undefined;
  // provider : 제공자
  provider: ProviderType | undefined;
  // role : 권한
  role: RoleType;
}

export class User {
  // email : 이메일
  email: string | undefined;
  // password : 비밀번호
  password: string | undefined;
  // nickName : 닉네임
  nickName: string;
  // birthday : 생일
  birthday: Date | undefined;
  // profileImg : 프로필 이미지
  profileImg: string | undefined;
  // snsId : sns 아이디
  snsId: string | undefined;
  // provider : 제공자
  provider: ProviderType | undefined;
  // role : 권한
  role: RoleType;

  constructor({
    email,
    password,
    nickName,
    birthday,
    profileImg,
    snsId,
    provider,
    role,
  }: IUser) {
    this.email = email;
    this.password = password;
    this.nickName = nickName;
    this.birthday = birthday;
    this.profileImg = profileImg;
    this.snsId = snsId;
    this.provider = provider;
    this.role = role;
  }

  toJson() {
    return {
      email: this.email,
      nickName: this.nickName,
      birthday: this.birthday,
      profileImg: this.profileImg,
      snsId: this.snsId,
      provider: this.provider,
      role: this.role,
    };
  }
  static fromJson(json: any): User {
    return new User({
      email: json.email ?? undefined,
      password: json.password ?? undefined,
      nickName: json.nickName,
      birthday: json.birthday ?? undefined,
      profileImg: json.profileImg ?? undefined,
      snsId: json.snsId ?? undefined,
      provider: json.provider ?? undefined,
      role: json.role ?? RoleType.USER,
    });
  }
  toUserModel() {
    return new UserModel({
      email: this.email,
      password: this.password,
      nickName: this.nickName,
      birthday: this.birthday,
      profileImg: this.profileImg,
      snsId: this.snsId,
      provider: this.provider,
      role: this.role,
    });
  }
  copyWith({
    email,
    password,
    nickName,
    birthday,
    profileImg,
    snsId,
    provider,
    role,
  }: IUser) {
    return new User({
      email: email ?? this.email,
      password: password ?? this.password,
      nickName: nickName ?? this.nickName,
      birthday: birthday ?? this.birthday,
      profileImg: profileImg ?? this.profileImg,
      snsId: snsId ?? this.snsId,
      provider: provider ?? this.provider,
      role: role ?? this.role,
    });
  }
}

const UserSchema = new Schema(
  {
    email: { type: String, required: false },
    password: { type: String, required: false },
    nickName: { type: String, required: true },
    birthday: { type: Date, required: false },
    profileImg: { type: String, required: false },
    snsId: { type: String, required: false },
    provider: { type: String, required: false },
    role: { type: Number, required: true },
  },
  { timestamps: true }
);

export const UserModel = model("User", UserSchema);
