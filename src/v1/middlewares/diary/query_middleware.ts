import { checkSchema } from "express-validator";
import { PAGINATE_LIMIT } from "../../../constant/default";
import { CustomHttpErrorModel } from "../../../models/custom_http_error_model";

/**
 * @DESC check diary query
 * checkingFields: count, category
 * count : 가지고올 갯수 (default: 10)
 * category : 카테고리 (default: 전체)
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
});
