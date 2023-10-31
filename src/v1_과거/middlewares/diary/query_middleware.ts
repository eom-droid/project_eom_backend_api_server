import { checkSchema } from "express-validator";
import { PAGINATE_LIMIT } from "../../../constant/default";
import { CustomHttpErrorModel } from "../../../models/custom_http_error_model";

/**
 * @DESC check diary query
 * checkingFields: count, category, postDT
 * count : 가지고올 갯수 (default: 10)
 * category : 카테고리 (default: 전체)
 * postDT : 해당 날짜 이전의 데이터만 가져옴
 */
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
