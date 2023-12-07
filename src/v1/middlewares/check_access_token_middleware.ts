import { checkSchema } from "express-validator";

/**
 * @DESC check access token in header middleware
 */
export const checkAccessTokenValidation = checkSchema({
  authorization: {
    in: ["headers"],
    isString: { bail: true },
  },
});
