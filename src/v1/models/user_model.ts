import { InferSchemaType, Schema, model } from "mongoose";
import { CustomHttpErrorModel } from "../../models/custom_http_error_model";

/**
 * 유저 모델
 */

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

export type User = InferSchemaType<typeof UserSchema>;

export const UserModel = model("user", UserSchema);

// export const jsonToUser = (json: any) => {
//   try {
//     const result = new UserModel({
//       email: json.email as string,
//       password: json.password as string,
//       nickName: json.nickName as string,
//       birthday: json.birthday as Date,
//       profileImg: json.profileImg as string,
//       snsId: json.snsId as string,
//       provider: json.provider as string,
//       role: json.role as number,
//     });

//     return result;
//   } catch (error) {
//     console.log(new Date().toISOString() + ": npm log: " + error);

//     throw new CustomHttpErrorModel({
//       message: "입력값이 유효하지 않습니다.",
//       status: 400,
//     });
//   }
// };

export const userToUserModel = (user: User) => {
  try {
    const result = new UserModel({
      email: user.email,
      password: user.password,
      nickName: user.nickName,
      birthday: user.birthday,
      profileImg: user.profileImg,
      snsId: user.snsId,
      provider: user.provider,
      role: user.role,
    });

    return result;
  } catch (error) {
    console.log(new Date().toISOString() + ": npm log: " + error);

    throw new CustomHttpErrorModel({
      message: "입력값이 유효하지 않습니다.",
      status: 400,
    });
  }
};
