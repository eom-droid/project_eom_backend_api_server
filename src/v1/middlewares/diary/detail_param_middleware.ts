import { checkSchema } from "express-validator";

/**
 * @DESC diary detail param validation
 * diary detail을 가져올 때 필요한 param validation
 */
export const diaryDetailParamValidation = checkSchema({
  id: {
    in: ["params"],
    isString: { bail: true },
  },
});
