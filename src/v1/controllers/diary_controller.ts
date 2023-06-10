import { Request, Response } from "express";
import * as diaryService from "../services/diary_service";

import { reqToDiary } from "../models/diary_model";
import { DiaryPaginateReqModel } from "../../models/diary_paginate_req_model";

export const createNewDiary = async (req: Request, res: Response) => {
  try {
    const diary = reqToDiary(req.body);

    var data = await diaryService.createDiary(
      diary,
      req.files !== undefined ? (req.files as Express.Multer.File[]) : undefined
    );

    return res.status(201).send({ status: "OK", data: data });
  } catch (error: any) {
    return res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

export const updateDiary = async (req: Request, res: Response) => {
  try {
    const diary = reqToDiary(req.body);

    var data = await diaryService.updateDiary(
      req.params.id,
      diary,
      req.files !== undefined ? (req.files as Express.Multer.File[]) : undefined
    );

    return res.status(201).send({ status: "OK", data: data });
  } catch (error: any) {
    return res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

export const getDiary = async (req: Request, res: Response) => {
  try {
    const diaryId = req.params.id;

    const data = await diaryService.getDiary(diaryId);

    return res.status(200).send(data);
  } catch (error: any) {
    return res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

export const getDiaries = async (req: Request, res: Response) => {
  try {
    const paginateReq = new DiaryPaginateReqModel(req.query);

    const data = await diaryService.getDiaries(paginateReq);

    return res.status(200).send(data);
  } catch (error: any) {
    return res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

// export const setFaker = async (req: Request, res: Response) => {
//   var yesterday = new Date();
//   yesterday.setDate(yesterday.getDate() - 1);
//   for (var i = 0; i < 10; i++) {
//     var diary = new DiaryModel({
//       title: "newtitle" + i,
//       writer: "newwriter" + i,
//       weather: "newjkljkl",
//       hashtags: ["sdfsdf", "sdfsdf"],
//       postDT: yesterday,
//       thumbnail: "",
//       category: "category" + i,
//       isShown: true,
//       txts: [],
//       imgs: [],
//       vids: [],
//       contentOrder: [],
//     });
//     await diary.save();
//   }
//   return;
// };

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
