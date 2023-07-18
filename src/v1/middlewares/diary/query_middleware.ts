import { checkSchema } from "express-validator";
import { PAGINATE_LIMIT } from "../../../constant/default";
import { CustomHttpErrorModel } from "../../../models/custom_http_error_model";

export const diaryQueryValidation = checkSchema({
  count: {
    in: ["query"],
    isInt: { bail: true, options: { min: 1, max: PAGINATE_LIMIT } },
    toInt: true,
    optional: true,
  },
  category: {
    in: ["query"],
    isString: { bail: true },
    optional: true,
  },
  postDT: {
    in: ["query"],
    isString: { bail: true },
    toDate: true,
    optional: true,
    custom: { options: isBeforeToday },
  },
});

function isBeforeToday(value: Date) {
  const givenDate = new Date(value);
  const currentDate = new Date();
  if (givenDate > currentDate) {
    throw new CustomHttpErrorModel({
      message: "postDT should be less than current date",
      status: 400,
    });
  }
  return true;
}
