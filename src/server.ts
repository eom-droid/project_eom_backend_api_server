import { diaryRouter, uploadRouter } from "./routes";
import express from "express";
import mongoose from "mongoose";

const app = express();

//middleware

// 반복적으로 나오는 try catch나 에러 처리 같은 경우에는 express에 미들웨어를 통해 진행함
const server = async () => {
  try {
    const { MONGO_URI, PORT } = process.env;

    if (!MONGO_URI) throw new Error("MONGO_URI is required!!!");
    if (!PORT) throw new Error("PORT is required!!!");

    await mongoose.connect(MONGO_URI);
    mongoose.set("debug", true);
    console.log("MongoDB connected");

    // app.use(express.json());

    app.use("/diary", diaryRouter);
    app.use("/upload", uploadRouter);

    app.listen(PORT, async () => {
      console.log(`server listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
server();
