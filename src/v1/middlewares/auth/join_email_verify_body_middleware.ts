import { checkSchema } from "express-validator";

// bail값을 지정하기는 하였지만
// validate 함수에서 해당 schema를 실행할 때
// Promise.all로 실행하기 때문에 모두다 실행됨
/**
 * @DESC join email body validation
 */
export const joinEmailVerifyBodyValidation = checkSchema({
  email: {
    in: ["body"],
    isString: { bail: true },
  },
  verificationCode: {
    in: ["body"],
    isString: { bail: true },
  },
});
