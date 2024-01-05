import { Request, Response, NextFunction } from "express";
import * as diaryService from "../services/diary_service";

import { jsonToDiary } from "../models/diary_model";
import {
  DiaryPaginateReqModel,
  PaginateReqModel,
} from "../../models/paginate_req_model";
import { CustomHttpErrorModel } from "../../models/custom_http_error_model";
import { RoleType, numberToRoleType } from "../../constant/default";

/**
 * @DESC create new diary
 * 새로운 diary를 생성함 파일과 함께 전송될 경우 해당 파일을 저장함
 * @RETURN diary
 */
export const createNewDiary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const diary = jsonToDiary(req.body);

    var data = await diaryService.createDiary(
      diary,
      req.files !== undefined ? (req.files as Express.Multer.File[]) : undefined
    );

    return res.status(201).send({ status: "OK", data: data });
  } catch (error: any) {
    next(error);
  }
};

/**
 * @DESC update diary
 * diary를 patch함 파일과 함께 전송될 경우 해당 파일을 저장함
 * @RETURN diary
 */
export const updateDiary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const diary = jsonToDiary(req.body);

    var data = await diaryService.updateDiary(
      req.params.id,
      diary,
      req.files !== undefined ? (req.files as Express.Multer.File[]) : undefined
    );

    return res.status(201).send({ status: "OK", data: data });
  } catch (error: any) {
    next(error);
  }
};

/**
 * @DESC get diary detail
 * 파라미터에 존재하는 id를 통해 특정 diary의 모든 정보를 가져옴
 */
export const getDiary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const diaryId = req.params.id;

    const data = await diaryService.getDiary(diaryId);

    return res.status(200).send(data);
  } catch (error: any) {
    next(error);
  }
};

/**
 * @DESC get diaries
 * pagination을 통해 특정 갯수만큼의 diary를 가져옴
 */
export const getDiaries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paginateReq = new DiaryPaginateReqModel(req.query);

    const data = await diaryService.getDiaries(paginateReq, req.decoded!.id);
    console.log(data);
    return res.status(200).send(data);
  } catch (error: any) {
    next(error);
  }
};

/**
 * @DESC delete diary
 * 파라미터에 존재하는 id를 통해 특정 diary를 삭제함
 * @RETURN diary
 */
export const deleteDiary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await diaryService.deleteDiary(id);

    return res.status(200).send({ status: "SUCCESS" });
    // return res.status(200).send(data);
  } catch (error: any) {
    next(error);
  }
};

/**
 * @DESC like diary
 * diary를 좋아요함
 */
export const createDiaryLike = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    // middleware에서 decode를 했고, validate를 진행했기 때문에 여기서는 id만 가져오면 됨
    const userId = req.decoded!.id;

    await diaryService.createDiaryLike(id, userId);

    return res.status(200).send({ status: "SUCCESS" });
  } catch (error: any) {
    next(error);
  }
};

/**
 * @DESC unlike diary
 * diary를 좋아요 취소함
 */

export const deleteDiaryLike = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    // middleware에서 decode를 했고, validate를 진행했기 때문에 여기서는 id만 가져오면 됨
    const userId = req.decoded!.id;

    await diaryService.deleteDiaryLike(id, userId);

    return res.status(200).send({ status: "SUCCESS" });
  } catch (error: any) {
    next(error);
  }
};

/**
 * @DESC get diary comment
 * diary에 댓글을 가져옴
 */
export const getDiaryComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const paginateReq = new PaginateReqModel(req.query);

    const data = await diaryService.getDiaryComments(
      id,
      req.decoded!.id,
      paginateReq
    );

    return res.status(200).send(data);
  } catch (error: any) {
    next(error);
  }
};

/**
 * @DESC create diary comment
 * diary에 댓글을 생성함
 */
export const createDiaryComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.decoded!.id;
    const { content } = req.body;

    const result = await diaryService.createDiaryComment(id, userId, content);

    // _id는 object이기 때문에 string으로 변환해줘야 함
    // 아니면 받을때 "" 값도 같이 받게됨
    return res.status(200).send(result._id.toString());
  } catch (error: any) {
    next(error);
  }
};

/**
 * @DESC delete diary comment
 * diary에 댓글을 삭제함
 */
export const deleteDiaryComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.decoded!.id;
    const userRole = numberToRoleType(req.user!.role);
    const { id } = req.params;

    await diaryService.deleteDiaryComment(id, userId, userRole);

    return res.status(200).send({ status: "SUCCESS" });
  } catch (error: any) {
    next(error);
  }
};

/**
 * @DESC update diary comment
 * diary에 댓글을 수정함
 */
export const updateDiaryComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.decoded!.id;
    const { commentId, content } = req.body;

    await diaryService.updateDiaryComment(commentId, userId, content);

    return res.status(200).send({ status: "SUCCESS" });
  } catch (error: any) {
    next(error);
  }
};

/**
 * @DESC like comment
 * comment를 좋아요함
 */
export const createDiaryCommentLike = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    // middleware에서 decode를 했고, validate를 진행했기 때문에 여기서는 id만 가져오면 됨
    const userId = req.decoded!.id;

    await diaryService.createDiaryCommentLike(id, userId);

    return res.status(200).send({ status: "SUCCESS" });
  } catch (error: any) {
    next(error);
  }
};

/**
 * @DESC unlike comment
 * comment를 좋아요 취소함
 */

export const deleteDiaryCommentLike = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    // middleware에서 decode를 했고, validate를 진행했기 때문에 여기서는 id만 가져오면 됨
    const userId = req.decoded!.id;

    await diaryService.deleteDiaryCommentLike(id, userId);

    return res.status(200).send({ status: "SUCCESS" });
  } catch (error: any) {
    next(error);
  }
};

/**
 * @DESC get diary comment's reply
 * diary에 댓글의 대댓글을 가져옴
 */
export const getDiaryReplys = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const paginateReq = new PaginateReqModel(req.query);

    const data = await diaryService.getDiaryReplys(
      id,
      req.decoded!.id,
      paginateReq
    );

    return res.status(200).send(data);
  } catch (error: any) {
    next(error);
  }
};

/**
 * @DESC create diary reply
 * diary에 댓글의 대댓글을 생성함
 */
export const createDiaryReply = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.decoded!.id;
    const { content } = req.body;

    const result = await diaryService.createDiaryReply(id, userId, content);

    // _id는 object이기 때문에 string으로 변환해줘야 함
    // 아니면 받을때 "" 값도 같이 받게됨
    return res.status(200).send(result._id.toString());
  } catch (error: any) {
    next(error);
  }
};
