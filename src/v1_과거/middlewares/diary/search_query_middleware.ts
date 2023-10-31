import { checkSchema } from "express-validator";

/**
 * @DESC diary query validation
 */
export const diarySearchQueryValidation = checkSchema({
  postDT: {
    in: ["query"],
    isString: { bail: true },
    toDate: true,
  },
});
