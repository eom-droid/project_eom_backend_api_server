import express from "express";
import mongoose from "mongoose";
import { diaryRouter } from "./v1/routes/diary_routes";
import { musicRouter } from "./v1/routes/music_routes";

const app = express();

// 반복적으로 나오는 try catch나 에러 처리 같은 경우에는 express에 미들웨어를 통해 진행함
const server = async () => {
  try {
    const { MONGO_URI, PORT } = process.env;

    if (!MONGO_URI) throw new Error("MONGO_URI is required!!!");
    if (!PORT) throw new Error("PORT is required!!!");

    await mongoose.connect(MONGO_URI);
    mongoose.set("debug", true);
    console.log("MongoDB connected");

    app.use("/api/v1/diaries", diaryRouter);
    app.use("/api/v1/musics", musicRouter);

    app.listen(PORT, async () => {
      console.log(`server listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
server();
