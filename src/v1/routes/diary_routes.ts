import express from "express";

import { createNewDiaryController } from "../controllers/diary_controller";

import { multiPartMiddleware } from "../middlewares/file_upload_middleware";
// const authenticate = require("../../middlewares/authenticate");
// const authorize = require("../../middlewares/authorize");

export const diaryRouter = express.Router();

diaryRouter.get("/", (res, req) => {
  return;
});
diaryRouter.post(
  "/",
  // milddleware
  multiPartMiddleware,
  createNewDiaryController
);
