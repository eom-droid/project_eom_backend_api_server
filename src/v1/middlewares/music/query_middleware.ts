import { checkSchema } from "express-validator";
import { PAGINATE_LIMIT } from "../../../constant/default";

/**
 * @DESC music query validation
 * music를 가져올 때 필요한 query validation
 */
export const musicQueryValidation = checkSchema({
  count: {
    in: ["query"],
    isInt: { bail: true, options: { min: 1, max: PAGINATE_LIMIT } },
    optional: true,
    toInt: true,
  },
  after: {
    in: ["query"],
    isString: { bail: true },
    optional: true,
  },
});
