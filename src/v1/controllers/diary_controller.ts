import { Request, Response } from "express";
import { Diary, DiaryDetail } from "../models/diary_model";
import { createDiaryService } from "../services/diary_service";

export const createNewDiaryController = async (req: Request, res: Response) => {
  try {
    const { body } = req;
    const diary = JSON.parse(body.diary);

    await createDiaryService(
      diary,
      req.files !== undefined ? (req.files as Express.Multer.File[]) : undefined
    );

    // // console.log(diary);
    // // console.log(diaryInstance.thumbnail);
    // await diaryInstance.save();

    res.status(201).send({ status: "OK", data: "allWorkouts" });
  } catch (error: any) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

export const getNewDiaryController = async (req: Request, res: Response) => {
  // try {
  //   const { body } = req;
  //   const diary = JSON.parse(body.diary);
  //   createDiaryService(
  //     diary,
  //     req.files !== undefined ? (req.files as Express.Multer.File[]) : undefined
  //   );
  //   // // console.log(diary);
  //   // // console.log(diaryInstance.thumbnail);
  //   // await diaryInstance.save();
  //   res.status(201).send({ status: "OK", data: "allWorkouts" });
  // } catch (error: any) {
  //   res
  //     .status(error?.status || 500)
  //     .send({ status: "FAILED", data: { error: error?.message || error } });
  // }
};
