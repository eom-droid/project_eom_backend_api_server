import { validationResult } from "express-validator/src/validation-result";
import { Request, Response, NextFunction } from "express";
import { ValidationChain } from "express-validator/src/chain/validation-chain";

/**
 * @DESC validate request(express-validation)
 * ValidationChain을 middleware로 사용하기 위한 함수
 * middleware라는 폴더에 원하는 validation을 checkSchema로 만들고
 * validate 함수를 통해 middleware로 사용
 */
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
