import { Response, Request, NextFunction } from "express";

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
