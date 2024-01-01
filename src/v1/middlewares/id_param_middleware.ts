import { checkSchema } from "express-validator";

/**
 * @DESC id param validation
 * id가 path parameter 상에 존재하는지 확인
 */
export const idParamValidation = checkSchema({
  id: {
    in: ["params"],
    isString: { bail: true },
  },
});

export const commentIdParamValidation = checkSchema({
  commentId: {
    in: ["params"],
    isString: { bail: true },
  },
});

export const idBodyValidation = checkSchema({
  id: {
    in: ["body"],
    isString: { bail: true },
  },
});
