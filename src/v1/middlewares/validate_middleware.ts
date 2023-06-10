import { validationResult } from "express-validator/src/validation-result";
import { Request, Response, NextFunction } from "express";
import { ValidationChain } from "express-validator/src/chain/validation-chain";

export const validate = (schemas: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(schemas.map((schema) => schema.run(req)));

    const result = validationResult(req);

    if (result.isEmpty()) {
      return next();
      // return res.status(200).send({ status: "SUCCESS" });
    }

    return res
      .status(400)
      .send({ status: "FAILED", data: { error: "잘못된 요청입니다." } });
  };
};
