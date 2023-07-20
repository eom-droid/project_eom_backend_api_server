import { checkSchema } from "express-validator";

// bail값을 지정하기는 하였지만
// validate 함수에서 해당 schema를 실행할 때
// Promise.all로 실행하기 때문에 모두다 실행됨
/**
 * @DESC music body validation
 * music를 생성할 때 필요한 body validation
 */
export const musicBodyValidation = checkSchema({
  title: {
    in: ["body"],
    isString: { bail: true },
  },
  artiste: {
    in: ["body"],
    isString: { bail: true },
  },
  review: {
    in: ["body"],
    isString: { bail: true },
  },
  albumCover: {
    in: ["body"],
    isString: { bail: true },
  },
  youtubeMusicId: {
    in: ["body"],
    isString: { bail: true },
  },
  spotifyId: {
    in: ["body"],
    isString: { bail: true },
  },
});
