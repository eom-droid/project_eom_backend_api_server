import express from "express";
import mongoose from "mongoose";
import { diaryRouter } from "./v1/routes/diary_routes";
import { musicRouter } from "./v1/routes/music_routes";

const app = express();

// 반복적으로 나오는 try catch나 에러 처리 같은 경우에는 express에 미들웨어를 통해 진행함
const server = async () => {
  try {
    // .env 파일 내에 있는 변수들을 불러옴
    // destructuring을 통해 변수를 불러옴
    const { MONGO_URI, PORT } = process.env;

    // .env 파일 내에 있는 변수들이 없을 경우 에러를 던짐
    if (!MONGO_URI) throw new Error("MONGO_URI is required!!!");
    if (!PORT) throw new Error("PORT is required!!!");

    // mongoose를 통해 MongoDB에 연결
    await mongoose.connect(MONGO_URI);

    // mongoose의 debug 모드를 활성화
    // mongoose.set("debug", true);
    console.log("MongoDB connected");

    // express의 미들웨어를 통해 req.body를 사용할 수 있도록 함
    // 추가적으로 해당 체계는 routes -> controllers -> services -> repository로 이어짐
    // routes : middelware를 실행 시키며 req와 res를 받아 controller로 넘김
    // controller : 쿼리 혹은 body를 통해 받은 데이터를 내부에서 사용하는 class 형태로 변경하여 service로 넘김
    // service : 서비스 로직에 대한 부분을 담당하며 repository를 활용하여 CURD를 진행함
    // repository : DB에 접근하는 부분을 담당하며 mongoose를 통해 DB에 접근함
    app.use("/api/v1/diaries", diaryRouter);
    app.use("/api/v1/musics", musicRouter);

    // 서버를 실행함
    app.listen(PORT, async () => {
      console.log(`server listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(new Date().toISOString() + ": npm log: " + error);
  }
};
server();
