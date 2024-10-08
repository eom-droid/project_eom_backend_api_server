import { checkSchema } from "express-validator";

// bail값을 지정하기는 하였지만
// validate 함수에서 해당 schema를 실행할 때
// Promise.all로 실행하기 때문에 모두다 실행됨
/**
 * @DESC diary query validation
 */
export const diaryBodyValidation = checkSchema({
  title: {
    in: ["body"],
    isString: true,
  },
  writer: {
    in: ["body"],
    isString: { bail: true },
  },
  weather: {
    in: ["body"],
    isString: { bail: true },
  },
  hashtags: {
    in: ["body"],
    isArray: { bail: true },
  },
  thumbnail: {
    in: ["body"],
    isString: {
      bail: true,
    },
  },
  category: {
    in: ["body"],
    isString: { bail: true },
  },
  txts: {
    in: ["body"],
    isArray: { bail: true },
  },
  imgs: {
    in: ["body"],
    isArray: { bail: true },
  },
  vids: {
    in: ["body"],
    isArray: { bail: true },
  },
  contentOrder: {
    in: ["body"],
    isArray: { bail: true },
  },
});
