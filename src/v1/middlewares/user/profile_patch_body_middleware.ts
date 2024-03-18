import { checkSchema } from "express-validator";

/**
 * @DESC profile update body validation
 *
 */
export const profilePatchBodyValidation = checkSchema({
  nickname: {
    in: ["body"],
    isString: { bail: true },
  },
});
