import { NextFunction, Response, Request } from "express";

import { isValidObjectId } from "mongoose";
import { DiaryModel } from "../models/diary_model";

export const checkIdMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).send({ status: "FAILED", data: { error: "not valid id" } });
    return;
  }

  if ((await DiaryModel.exists({ _id: id })) === null) {
    res.status(400).send({ status: "FAILED", data: { error: "not exist id" } });
    return;
  }

  next();
};
