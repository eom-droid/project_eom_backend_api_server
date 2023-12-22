import { Request, Response, NextFunction } from "express";
import * as diaryService from "../services/diary_service";

import { jsonToDiary } from "../models/diary_model";
import { DiaryPaginateReqModel } from "../../models/paginate_req_model";
import { CustomHttpErrorModel } from "../../models/custom_http_error_model";

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

    const data = await diaryService.getDiaries(paginateReq);
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

// export const createDiaryLike = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { id } = req.params;
//     const user = req.user;
//     if (user === null) {
//       throw new CustomHttpErrorModel({
//         status: 400,
//         message: "로그인이 필요합니다.",
//       });
//     }

//     await diaryService.createDiaryLike(id, user._id);

//     return res.status(200).send({ status: "SUCCESS" });
//   } catch (error: any) {
//     next(error);
//   }
// };
