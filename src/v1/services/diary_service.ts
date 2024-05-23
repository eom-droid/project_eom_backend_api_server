import {
  DiaryPaginateReqModel,
  PaginateReqModel,
} from "../../models/paginate_req_model";
import { PaginateResModel } from "../../models/paginate_res_model";
import { Diary } from "../models/diary_model";

import * as diaryRepository from "../repositorys/diary_repository";
import * as diaryCommentRepository from "../repositorys/diary_comment_repository";
import * as diaryReplyRepository from "../repositorys/diary_reply_repository";
import * as diaryLikeRepository from "../repositorys/diary_like_repository";
import * as diaryCommentLikeRepository from "../repositorys/diary_comment_like_repository";
import * as diaryReplyLikeRepository from "../repositorys/diary_reply_like_repository";
import { AWSUtils } from "../../utils/aws_utils";
import { CustomHttpErrorModel } from "../../models/custom_http_error_model";
import { DiaryLikeModel } from "../models/diary_like_model";
import { RoleType, S3DiaryPath } from "../../constant/default";
import { Types } from "mongoose";

/**
 * @DESC create new diary
 * 새로운 diary를 생성함 파일과 함께 전송될 경우 해당 파일을 저장함
 * 파일 업로드와 이름 매칭을 진행함
 * @RETURN diary
 */
export const createDiary = async (
  diary: Diary,
  files: Express.Multer.File[] | undefined
) => {
  try {
    // 파일 업로드 및 이름 매칭
    if (files !== undefined) {
      const uploadCompleteFiles = await AWSUtils.uploadFileToS3({
        s3Path: S3DiaryPath,
        file: files,
      });

      matchFileNames(
        diary,
        uploadCompleteFiles instanceof Array
          ? uploadCompleteFiles
          : [uploadCompleteFiles]
      );
    }

    return await diaryRepository.createDiary(diary);
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC update diary
 * diary를 patch함 파일과 함께 전송될 경우 해당 파일을 저장함
 * 파일 업로드와 이름 매칭을 진행함
 * 기존 파일중에서 삭제된 파일이 있다면 s3에서 삭제함
 * @RETURN diary
 */
export const updateDiary = async (
  id: string,
  diary: Diary,
  files: Express.Multer.File[] | undefined
) => {
  try {
    const oldDiary = await diaryRepository.getDiary(id);
    if (oldDiary == null) {
      throw new CustomHttpErrorModel({
        status: 400,
        message: "값이 존재하지 않습니다.",
      });
    }

    // 삭제 파일 filter
    // 기존 oldDiary에서 diary(newDiary)에 없는 파일들을 삭제할 파일로 지정
    const deleteImgs = oldDiary.imgs.filter((e) => !diary.imgs.includes(e));
    const deleteVids = oldDiary.vids.filter((e) => !diary.vids.includes(e));

    // 삭제할 파일들을 s3에서 삭제
    await AWSUtils.deleteFileFromS3({
      files: deleteImgs.concat(deleteVids),
    });

    if (files != undefined) {
      const uploadCompleteFiles = await AWSUtils.uploadFileToS3({
        s3Path: S3DiaryPath,
        file: files,
      });

      matchFileNames(
        diary,
        uploadCompleteFiles instanceof Array
          ? uploadCompleteFiles
          : [uploadCompleteFiles]
      );
    }

    return await diaryRepository.updateDiary(id, diary);
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC get diaries
 * pagination을 통해 특정 갯수만큼의 diary를 가져옴
 * userId가 존재할 경우 해당유저가 좋아요를 했는지 확인함
 */
export const getDiaries = async ({
  paginateReq,
  userId,
}: {
  paginateReq: DiaryPaginateReqModel;
  userId?: string;
}): Promise<PaginateResModel<Diary>> => {
  const result = await diaryRepository.getDiaries({ paginateReq, userId });

  return new PaginateResModel<Diary>({
    meta: {
      count: result.length,
      hasMore: result.length === paginateReq.count,
    },
    data: result,
  });
};

/**
 * @DESC get diary detail
 * 파라미터에 존재하는 id를 통해 특정 diary의 모든 정보를 가져옴
 */
export const getDiary = async ({
  diaryId,
  userId,
}: {
  diaryId: string;
  userId?: string;
}) => {
  const temp = await diaryRepository.getDiary(diaryId);

  if (temp == null || (temp.isShown !== undefined && temp.isShown === false)) {
    throw new CustomHttpErrorModel({
      status: 400,
      message: "값이 존재하지 않습니다.",
    });
  }

  const result = await diaryRepository.getDiaryWithLike({
    diaryId,
    userId,
  });
  if (result == null) {
    throw new CustomHttpErrorModel({
      status: 400,
      message: "값이 존재하지 않습니다.",
    });
  } else {
    return result;
  }
};

/**
 * @DESC delete diary
 * diary를 삭제함
 * diary에 있는 thumbnail, imgs, vids를 s3에서 삭제함
 */
export const deleteDiary = async (diaryId: string): Promise<void> => {
  // 원래 findOneAndDelete를 진행해도 됨
  // 더빠를듯
  // 안정적으로 진행하기 위해서 이렇게 함
  const result = await diaryRepository.getDiary(diaryId);

  if (result != null) {
    // diary의
    // const deletingFiles = result.imgs.concat(result.vids);

    // await Promise.all(
    //   deletingFiles.map((e) => {
    //     AWSUtils.deleteFileFromS3({
    //       files: [e],
    //     });
    //   })
    // );
    // await diaryRepository.deleteDiary(diaryId);
    await diaryRepository.patchDiaryIsShownFalse(diaryId);
  }
  return;
};

/**
 * @DESC match file names
 * diary에 있는 thumbnail, imgs, vids와 files에 있는 originalname을 비교해서
 * 일치하는 값이 있다면 해당 값에 맞는 filename으로 바꿔줌
 */
const matchFileNames = (diary: Diary, files: Express.Multer.File[]) => {
  for (var i = 0; i < files.length; i++) {
    const filename = files[i].filename;
    const originalname = files[i].originalname;

    // file 중에 thumbnail 값이 일치하다면 diaryObj.thumbnail에 넣어주기
    if (diary.thumbnail === originalname) {
      diary.thumbnail = filename;
    }

    // file 중에 img 값이 일치하다면 diaryDetailObj.imgs에 넣어주기
    const imgFoundIndex = diary.imgs.findIndex((e) => e === originalname);
    if (imgFoundIndex !== -1) {
      diary.imgs[imgFoundIndex] = filename;
      continue;
    }

    // file 중에 vid 값이 일치하다면 diaryDetailObj.vids에 넣어주기
    const vidFoundIndex = diary.vids.findIndex((e) => e === originalname);
    if (vidFoundIndex !== -1) {
      diary.vids[vidFoundIndex] = filename;
      continue;
    }
  }
};

/**
 * @DESC like diary
 * 현재 좋아여 여부를 확인하고 diary를 좋아요함
 */
export const createDiaryLike = async (diaryId: string, userId: string) => {
  try {
    // diary에 대한 존재 여부는 확인할 필요가 없음 --> middleware에서 확인함
    const result = await diaryLikeRepository.getDiaryLike(diaryId, userId);
    // 좋아요를 한적이 없다면
    if (result === null) {
      await diaryLikeRepository.createDiaryLike(diaryId, userId);
    }
    return;
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC unlike diary
 * diary를 좋아요 취소함
 */
export const deleteDiaryLike = async (diaryId: string, userId: string) => {
  try {
    // diary에 대한 존재 여부는 확인할 필요가 없음 --> middleware에서 확인함
    const result = await diaryLikeRepository.getDiaryLike(diaryId, userId);
    // 좋아요를 한적이 있다면
    if (result !== null) {
      await diaryLikeRepository.deleteDiaryLike(diaryId, userId);
    }
    return;
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC get diary comment
 * diary에 댓글을 가져옴
 */

export const getDiaryComments = async ({
  diaryId,
  userId,
  paginateReq,
}: {
  diaryId: string;
  userId?: string;
  paginateReq: PaginateReqModel;
}) => {
  try {
    const result = await diaryCommentRepository.getDiaryComments({
      diaryId,
      userId,
      paginateReq,
    });

    return new PaginateResModel({
      meta: {
        count: result.length,
        hasMore: result.length === paginateReq.count,
      },
      data: result,
    });
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC create diary comment
 * diary에 댓글을 생성함
 */
export const createDiaryComment = async (
  diaryId: string,
  userId: string,
  content: string
) => {
  try {
    const result = await diaryCommentRepository.createDiaryComment(
      diaryId,
      userId,
      content
    );
    return result;
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC delete diary comment
 * diary에 댓글을 삭제함
 */
export const deleteDiaryComment = async (
  commentId: string,
  userId: string,
  userRole: RoleType
) => {
  try {
    if (userRole !== RoleType.ADMIN) {
      const comment = await diaryCommentRepository.getDiaryCommentById(
        commentId
      );
      if (comment == null) {
        throw new CustomHttpErrorModel({
          status: 400,
          message: "값이 존재하지 않습니다.",
        });
      }
      if (comment.userId.toString() !== userId) {
        throw new CustomHttpErrorModel({
          status: 400,
          message: "권한이 없습니다.",
        });
      }
    }
    const result = await diaryCommentRepository.deleteDiaryComment(commentId);
    const diaryCommentLikeDeleteResult =
      await diaryCommentLikeRepository.deleteDiaryCommentLikeByCommentId(
        commentId
      );
    return result;
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC update diary comment
 * diary에 댓글을 수정함
 */

export const updateDiaryComment = async (
  commentId: string,
  userId: string,
  content: string
) => {
  try {
    const comment = await diaryCommentRepository.getDiaryCommentById(commentId);

    if (comment == null) {
      throw new CustomHttpErrorModel({
        status: 400,
        message: "값이 존재하지 않습니다.",
      });
    }
    if (comment.userId.toString() !== userId) {
      throw new CustomHttpErrorModel({
        status: 400,
        message: "권한이 없습니다.",
      });
    }

    const result = await diaryCommentRepository.updateDiaryComment(
      commentId,
      content
    );
    return result;
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC create diary comment like
 * diary에 댓글을 좋아요함
 */
export const createDiaryCommentLike = async (
  commentId: string,
  userId: string
) => {
  try {
    // diary에 대한 존재 여부는 확인할 필요가 없음 --> middleware에서 확인함
    const result = await diaryCommentLikeRepository.getDiaryCommentLike(
      commentId,
      userId
    );
    // 좋아요를 한적이 없다면
    if (result === null) {
      await diaryCommentLikeRepository.createDiaryCommentLike(
        commentId,
        userId
      );
    }
    return;
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC delete diary comment like
 * diary에 댓글을 좋아요 취소함
 */
export const deleteDiaryCommentLike = async (
  commentId: string,
  userId: string
) => {
  try {
    // diary에 대한 존재 여부는 확인할 필요가 없음 --> middleware에서 확인함
    const result = await diaryCommentLikeRepository.getDiaryCommentLike(
      commentId,
      userId
    );
    // 좋아요를 한적이 있다면
    if (result !== null) {
      await diaryCommentLikeRepository.deleteDiaryCommentLike(
        commentId,
        userId
      );
    }
    return;
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC get diary comment's reply
 * diary에 댓글의 댓글을 가져옴
 */
export const getDiaryReplys = async ({
  commentId,
  userId,
  paginateReq,
}: {
  commentId: string;
  userId?: string;
  paginateReq: PaginateReqModel;
}) => {
  try {
    const result = await diaryReplyRepository.getDiaryReplys({
      commentId,
      userId,
      paginateReq,
    });

    return new PaginateResModel({
      meta: {
        count: result.length,
        hasMore: result.length === paginateReq.count,
      },
      data: result,
    });
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC create diary reply
 * diary에 댓글의 댓글을 생성함
 */
export const createDiaryReply = async (
  commentId: string,
  userId: string,
  content: string
) => {
  try {
    const result = await diaryReplyRepository.createDiaryReply(
      commentId,
      userId,
      content
    );
    return result;
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC delete diary reply
 * diary에 댓글의 댓글을 삭제함
 */
export const deleteDiaryReply = async (
  replyId: string,
  userId: string,
  userRole: RoleType
) => {
  try {
    if (userRole !== RoleType.ADMIN) {
      const reply = await diaryReplyRepository.getDiaryReplyById(replyId);
      if (reply == null) {
        throw new CustomHttpErrorModel({
          status: 400,
          message: "값이 존재하지 않습니다.",
        });
      }
      if (reply.userId.toString() !== userId) {
        throw new CustomHttpErrorModel({
          status: 400,
          message: "권한이 없습니다.",
        });
      }
    }
    const result = await diaryReplyRepository.deleteDiaryReply(replyId);
    const diaryReplyLikeDeleteResult =
      await diaryReplyLikeRepository.deleteDiaryReplyLikeByReplyId(replyId);
    return result;
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC update diary reply
 * diary에 댓글의 댓글을 수정함
 */
export const updateDiaryReply = async (
  replyId: string,
  userId: string,
  content: string
) => {
  try {
    // 불필요할 가능성이 있음 -> middleware에서 확인함
    const reply = await diaryReplyRepository.getDiaryReplyById(replyId);
    if (reply == null) {
      throw new CustomHttpErrorModel({
        status: 400,
        message: "값이 존재하지 않습니다.",
      });
    }
    if (reply.userId.toString() !== userId) {
      throw new CustomHttpErrorModel({
        status: 400,
        message: "권한이 없습니다.",
      });
    }

    const result = await diaryReplyRepository.updateDiaryReply(
      replyId,
      content
    );
    return result;
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC create diary reply like
 * diary에 대댓글 좋아요함
 */
export const createDiaryReplyLike = async (replyId: string, userId: string) => {
  try {
    // diary comment에 대한 존재 여부는 확인할 필요가 없음 --> middleware에서 확인함
    const result = await diaryReplyLikeRepository.getDiaryReplyLike(
      replyId,
      userId
    );
    // 좋아요를 한적이 없다면
    if (result === null) {
      await diaryReplyLikeRepository.createDiaryReplyLike(replyId, userId);
    }
    return;
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC delete diary reply like
 * diary에 대댓글 좋아요 취소함
 */
export const deleteDiaryReplyLike = async (replyId: string, userId: string) => {
  try {
    // diary comment에 대한 존재 여부는 확인할 필요가 없음 --> middleware에서 확인함
    const result = await diaryReplyLikeRepository.getDiaryReplyLike(
      replyId,
      userId
    );
    // 좋아요를 한적이 있다면
    if (result !== null) {
      await diaryReplyLikeRepository.deleteDiaryReplyLike(replyId, userId);
    }
    return;
  } catch (error: any) {
    throw error;
  }
};
