import { query } from "express-validator";
import { PAGINATE_LIMIT } from "../../../constant/default";
import { CustomHttpErrorModel } from "../../../models/custom_http_error_model";

export const diaryQueryValidation = [
  query("count")
    .isInt({ min: 1, max: PAGINATE_LIMIT })
    .optional()
    .toInt()
    .bail(),
  query("category").isString().optional().bail(),
  query("postDateInd").isInt({ min: 0 }).optional().toInt().bail(),
  query("postDT")
    .isString()
    .optional()
    .toDate()
    .custom((value: Date, { req }) => {
      const givenDate = new Date(value);
      const currentDate = new Date();
      if (givenDate > currentDate) {
        throw new CustomHttpErrorModel({
          message: "postDT should be less than current date",
          status: 400,
        });
      }
      return true;
    })
    .bail(),
];
