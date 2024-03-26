import * as userRepository from "../repositorys/user_repository";
import * as deletedUserRepository from "../repositorys/deleted_user_repository";

import { User } from "../models/user_model";
import axios from "axios";
import { userToDeletedUserModel } from "../models/deleted_user_model";
import {
  getOrCreateGoogleUserByWeb,
  getOrCreateAppleUserByWeb,
} from "./auth_service";
import { AWSUtils } from "../../utils/aws_utils";
import { S3UserProfilePath } from "../../constant/default";
import { profileEnd } from "console";
import { Redis } from "../../redis/redis";

/**
 * @DESC email login
 * 현재는 사용 안함
 */
// export const getMyInfo = async (authorizationValue: string) => {
//   try {
//     const decryptedUserId = AuthUtils.verifyAccessToken(
//       AuthUtils.splitBaererToken(authorizationValue)
//     ).id;

//     const user = await authRepository.searchUserById(decryptedUserId);

//     return user;
//   } catch (error: any) {
//     throw error;
//   }
// };

/**
 * @DESC update user nickname
 * user의 nickname을 변경
 */

export const updateProfile = async ({
  userId,
  user,
  nickname,
  newProfileImg,
  files,
}: {
  userId: string;
  user: User;
  nickname: string;
  newProfileImg: string | undefined;
  files: Express.Multer.File[] | undefined;
}) => {
  try {
    const oldProfileImg = user.profileImg;
    var profileImg = undefined;
    const havNewProfile = files !== undefined && files.length === 1;
    // 만약 업로드할 파일이 있다면
    if (havNewProfile) {
      // 그런데 기존 프로필 이미지가 있다면 -> 삭제한다
      if (oldProfileImg !== undefined) {
        await AWSUtils.deleteFileFromS3({
          files: [oldProfileImg],
        });
      }
      // 새로운 프로필 이미지를 업로드한다
      const uploadCompleteFiles = await AWSUtils.uploadFileToS3({
        s3Path: S3UserProfilePath,
        file: files,
      });

      if (uploadCompleteFiles instanceof Array) {
        profileImg = uploadCompleteFiles[0].filename;
      } else {
        profileImg = uploadCompleteFiles.filename;
      }
    } else {
      // 만약 업로드할 파일이 없다면
      // 그런데 newProfileImg가 http로 시작하지 않고 undefined라면 -> 삭제한다
      if (newProfileImg === undefined && oldProfileImg !== undefined) {
        await AWSUtils.deleteFileFromS3({
          files: [oldProfileImg],
        });
        profileImg = undefined;
      } else {
        profileImg = oldProfileImg;
      }
    }

    return await userRepository.updateProfile({
      userId,
      nickname,
      profileImg,
    });
  } catch (error: any) {
    throw error;
  }
};

export const deleteKakaoUser = async (user: User, userId: string) => {
  // 사용자가 생성한 모든 데이터를 지우는 로직이 필요함(일단 임시로 바로 지우는 로직을 넣을거임 나중에는 스케줄러에 등록할 예정)
  try {
    if (user.provider !== "kakao") {
      throw new Error("카카오 회원이 아닙니다.");
    }

    // await deleteAllUserData(userId);
    await requestKakaoAccountRevoke(user.snsId!);
    // 지워진 유저를 deletedUser에 추가
    await deletedUserRepository.addDeletedUser(
      userToDeletedUserModel(user, userId)
    );
    // user table에서  유저를 삭제
    await userRepository.deleteUser(userId);
  } catch (error) {
    throw error;
  }
};

export const deleteEmailUser = async (user: User, userId: string) => {
  try {
    await deletedUserRepository.addDeletedUser(
      userToDeletedUserModel(user, userId)
    );
    await userRepository.deleteUser(userId);
  } catch (error) {
    throw error;
  }
};

export const deleteGoogleUser = async (code: string) => {
  const { GOOGLE_REVOKE_REDIRECT_URI } = process.env;

  try {
    // getGoogleUserByWeb을 통해 user와 googleAccessToken을 받아옴
    const { user, googleAccessToken } = await getOrCreateGoogleUserByWeb({
      code,
      redirect_uri: GOOGLE_REVOKE_REDIRECT_URI,
    });

    const userId = user!._id.toString();
    // googleAccessToken을 통해 google 계정을 탈퇴시킴
    await requestGoogleAccountRevoke(googleAccessToken);
    // 지워진 유저를 deletedUser에 추가
    await deletedUserRepository.addDeletedUser(
      userToDeletedUserModel(user!, userId)
    );
    // user table에서  유저를 삭제
    await userRepository.deleteUser(userId);
  } catch (error) {
    throw error;
  }
};

export const deleteAppleUser = async (code: string) => {
  try {
    const { APPLE_REVOKE_REDIRECT_URI } = process.env;

    const { apple_refresh_token, user, apple_client_secret } =
      await getOrCreateAppleUserByWeb({
        code,
        redirect_uri: APPLE_REVOKE_REDIRECT_URI,
      });
    const userId = user!._id.toString();
    await requestAppleAccountRevoke(apple_refresh_token, apple_client_secret);
    await deletedUserRepository.addDeletedUser(
      userToDeletedUserModel(user!, userId)
    );
    await userRepository.deleteUser(userId);
  } catch (error) {
    throw error;
  }
};

export const logout = async (userId: string) => {
  try {
    await Redis.getInstance().del(userId);
  } catch (error) {
    throw error;
  }
};

// // 관련 모든 자료를 지우는 로직
// const deleteAllUserData = async (userId: string) => {
//   // // 1. diary 좋아요 지우기
//   // diaryLikeRepository.deleteDiaryLikeByUserId(userId);
//   // // 2. diary 댓글 삭제
//   // diaryCommentRepository.deleteDiaryCommentByUserId(userId);
//   // // 3. diary 댓글 좋아요 삭제
//   // diaryCommentLikeRepository.deleteDiaryCommentLikeByUserId(userId);
//   // // 4. diary 대댓글 삭제
//   // diaryReplyRepository.deleteDiaryReplyByUserId(userId);
//   // // 5. diary 대댓글 좋아요 삭제
//   // diaryReplyLikeRepository.deleteDiaryReplyLikeByUserId(userId);
//   // // 6. chat, chatRoom, chatMemeber 삭제
// };

const requestKakaoAccountRevoke = async (kakaoSnsId: string) => {
  const KAKAO_UNLINK_URI = "https://kapi.kakao.com/v1/user/unlink";
  try {
    const unlink_res = await axios.post(
      KAKAO_UNLINK_URI,
      {
        target_id_type: "user_id",
        target_id: 659683531, //  해당 사용자 id(카카오 회원번호)
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "KakaoAK " + process.env.KAKAO_ADMIN_KEY,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

const requestGoogleAccountRevoke = async (googleAccessToken: string) => {
  const GOOGLE_REVOKE_URI =
    "https://accounts.google.com/o/oauth2/revoke?token=" + googleAccessToken;
  try {
    const revoke_res = await axios.get(GOOGLE_REVOKE_URI);
  } catch (error) {
    throw error;
  }
};

const requestAppleAccountRevoke = async (
  refresh_or_access_token: string,
  client_secret: string
) => {
  const APPLE_REVOKE_URI = "https://appleid.apple.com/auth/revoke";
  try {
    const { APPLE_CLIENT_ID } = process.env;
    const revoke_res = await axios.post(
      APPLE_REVOKE_URI,
      {
        client_id: APPLE_CLIENT_ID,
        client_secret: client_secret,
        token: refresh_or_access_token,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return revoke_res;
  } catch (error) {
    throw error;
  }
};
