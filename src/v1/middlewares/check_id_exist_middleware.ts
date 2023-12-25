import { NextFunction, Response, Request } from "express";

import { Model, isValidObjectId } from "mongoose";
import { DataPassType } from "../../constant/default";

/**
 * @DESC check id exist
 * 해당 id가 존재하는지 확인
 */
export const checkIdExistMiddleware = (
  model: typeof Model<any>,
  dataPassBy?: DataPassType,
  key?: string
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      key = key ?? "id";
      var id = null;
      switch (dataPassBy) {
        case DataPassType.PARAMS:
          id = req.params[key];
          break;
        case DataPassType.BODY:
          id = req.body[key];
          break;
        case DataPassType.QUERY:
          id = req.query[key];
          break;
        default:
          id = req.params[key];
          break;
      }

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
    } catch (error: any) {
      return res
        .status(500)
        .send({ status: "FAILED", data: { error: error.message } });
    }
  };
};
