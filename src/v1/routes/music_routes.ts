import express from "express";

import * as musicController from "../controllers/music_controller";

export const musicRouter = express.Router();

import { validate } from "../middlewares/validate_middleware";
import { musicQueryValidation } from "../middlewares/music/query_middleware";
import { musicBodyValidation } from "../middlewares/music/body_middleware";
import { multerMiddleware } from "../middlewares/multer_middleware";
import { nestedBodyParser } from "../../middlewares/nested_body_parser";
import { authCheck } from "../middlewares/authenticate_middleware";
import { MUSIC, RoleType } from "../../constant/default";
import { idParamValidation } from "../middlewares/detail_param_middleware";
import { checkIdExistMiddleware } from "../middlewares/check_id_exist_middleware";
import { MusicModel } from "../models/music_model";
import { checkAccessTokenValidation } from "../middlewares/check_access_token_middleware";

/**
 * @GET /api/v1/musics
 * @DESC paginate musics
 */
musicRouter.get(
  "/",
  // authCheck({
  //   role: RoleType.USER,
  // }),

  validate(musicQueryValidation),
  musicController.getMusics
);

/**
 * @POST /api/v1/musics
 * @DESC create new musics
 */
musicRouter.post(
  "/",
  authCheck({
    role: RoleType.ADMIN,
    userRequire: true,
  }),
  multerMiddleware,
  nestedBodyParser("music"),
  validate(musicBodyValidation),
  musicController.createNewMusics
);

/**
 * @PATCH /api/v1/musics/{id}
 * @DESC update music
 */
musicRouter.patch(
  "/:id",
  authCheck({
    role: RoleType.ADMIN,
    userRequire: true,
  }),
  multerMiddleware,
  nestedBodyParser(MUSIC),
  validate(musicBodyValidation.concat(idParamValidation)),
  checkIdExistMiddleware(MusicModel),
  musicController.updateMusic
);

/**
 * @DELETE /api/v1/musics/{id}
 * @DESC delete music
 */
musicRouter.delete(
  "/:id",
  authCheck({
    role: RoleType.ADMIN,
    userRequire: true,
  }),
  validate(idParamValidation),
  checkIdExistMiddleware(MusicModel),
  musicController.deleteMusic
);
