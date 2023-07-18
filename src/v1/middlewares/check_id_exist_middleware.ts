import { NextFunction, Response, Request } from "express";

import { Model, Models, Schema, isValidObjectId } from "mongoose";

export const checkIdExistMiddleware = (model: typeof Model<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .send({ status: "FAILED", data: { error: "not valid id" } });
    }

    // if (model === DIARY) {
    if ((await model.exists({ _id: id })) === null) {
      return res
        .status(400)
        .send({ status: "FAILED", data: { error: "not exist id" } });
    }
    // }

    return next();
  };
};

export const checkPostDTExistMiddleware = (model: typeof Model<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { postDT } = req.query;
    console.log(postDT);

    if ((await model.exists({ postDT: postDT })) === null) {
      return res.status(201).send(false);
    } else {
      return res.status(200).send(true);
    }
  };
};
