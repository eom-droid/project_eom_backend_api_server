import { Response } from "express";

interface ICustomError {
  error: any;
  res: Response;
}

export class DataUtils {
  static errorHandle({ error, res }: ICustomError) {
    let message = "Unknown Error";
    if (error instanceof Error) message = error.message;
    // 진행은 하겠지만, 리포트는 전송하자.
    reportError({ message });
  }
}

export function errorHandle(error: any) {}
