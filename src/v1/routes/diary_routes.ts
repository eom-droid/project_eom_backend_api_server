import express from "express";

import {
  createNewDiaryController,
  getDiarysController,
} from "../controllers/diary_controller";

import { multiPartMiddleware } from "../middlewares/file_upload_middleware";
// const authenticate = require("../../middlewares/authenticate");
// const authorize = require("../../middlewares/authorize");

export const diaryRouter = express.Router();

diaryRouter.get("/", getDiarysController);
diaryRouter.post(
  "/",
  // milddleware
  multiPartMiddleware,
  createNewDiaryController
);
