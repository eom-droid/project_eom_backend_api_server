import { query } from "express-validator";
import { PAGINATE_LIMIT } from "../../../constant/default";

export const musicQueryValidation = [
  query("count")
    .isInt({ min: 1, max: PAGINATE_LIMIT })
    .optional()
    .toInt()
    .bail(),
  query("after").isString().optional().bail(),
];
