import { param } from "express-validator";

export const diaryParamValidation = [param("id").isString()];
