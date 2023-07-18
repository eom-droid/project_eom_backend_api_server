import { param } from "express-validator";

export const diaryDetailParamValidation = [param("id").isString()];
