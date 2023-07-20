import { Response, Request, NextFunction } from "express";

/**
 * @DESC nested body를 flat하게 만들어주는 미들웨어
 * multipart/form-data로 전송된 body는 파일과 함께 전송되기 때문에
 * body를 flat하게 만들어주는 미들웨어가 필요함
 */
export const nestedBodyParser = (nestedPath: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body[nestedPath] === undefined) {
        throw new Error("body structure is wrong.");
      }
      req.body = JSON.parse(req.body[nestedPath]);
      return next();
    } catch (error) {
      return res.status(400).send({
        status: "FAILED",
        data: { error: "body structure is wrong." },
      });
    }
  };
};
