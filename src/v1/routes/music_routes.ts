import express from "express";

import * as musicController from "../controllers/music_controller";

export const musicRouter = express.Router();

import { validate } from "../middlewares/validate_middleware";
import { musicQueryValidation } from "../middlewares/music/query_middleware";
import { musicBodyValidation } from "../middlewares/music/body_middleware";
import { multerMiddleware } from "../middlewares/multer_middleware";
import { nestedBodyParser } from "../../middlewares/nested_body_parser";
import { authCheck } from "../middlewares/authenticate_middleware";

musicRouter.get(
  "/",
  authCheck,
  validate(musicQueryValidation),
  musicController.getMusics
);

musicRouter.post(
  "/",
  authCheck,
  multerMiddleware,
  nestedBodyParser("music"),
  validate(musicBodyValidation),
  musicController.createNewMusics
);
