import { checkSchema } from "express-validator";

export const diarySearchQueryValidation = checkSchema({
  postDT: {
    in: ["query"],
    isString: { bail: true },
    toDate: true,
  },
});
