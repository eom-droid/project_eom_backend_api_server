import { Request, Response } from "express";
import * as diaryService from "../services/diary_service";
import { CustomHttpErrorModel } from "../../models/custom_http_error_model";
import { PAGINATE_LIMIT } from "../../constant/default";
import { DiaryModel, reqToDiary } from "../models/diary_model";
import { DiaryPaginateReqModel } from "../../models/diary_paginate_req_model";
import { validationResult } from "express-validator";

export const createNewDiary = async (req: Request, res: Response) => {
  try {
    const diary = reqToDiary(req);

    var data = await diaryService.createDiary(
      diary,
      req.files !== undefined ? (req.files as Express.Multer.File[]) : undefined
    );

    res.status(201).send({ status: "OK", data: data });
  } catch (error: any) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

// export const test = async (req: Request, res: Response) => {
//   const date = new Date();
//   console.log(date);
//   try {
//     var theDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

//     console.log(theDate);

//     const result = await DiaryModel.find({
//       postDT: {
//         $lte: theDate,
//       },
//     }).sort({ postDT: 1, postDateInd: -1 });

//     console.log(result);

//     return res.status(200).send({ status: "OK", data: result });
//   } catch (e: any) {
//     console.log(e);
//     throw { status: 400, message: "값이 존재하지 않습니다." };
//   }
// };

export const getDiaries = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      throw new CustomHttpErrorModel({
        message: "잘못된 요청입니다.",
        status: 400,
      });
    }

    const paginateReq = new DiaryPaginateReqModel(req.body);

    const data = await diaryService.getDiaries(paginateReq);

    return res.status(200).send(data);
  } catch (error: any) {
    console.log(
      `[statusCode: ${error?.status || "???"}] [message: "${
        error?.message || "???"
      }}"]`
    );
    return res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

export const setFaker = async (req: Request, res: Response) => {
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  for (var i = 0; i < 10; i++) {
    var diary = new DiaryModel({
      title: "newtitle" + i,
      writer: "newwriter" + i,
      weather: "newjkljkl",
      hashtags: ["sdfsdf", "sdfsdf"],
      postDT: yesterday,
      thumbnail: "",
      category: "category" + i,
      isShown: true,
      txts: [],
      imgs: [],
      vids: [],
      contentOrder: [],
    });
    await diary.save();
  }
  return;
};
