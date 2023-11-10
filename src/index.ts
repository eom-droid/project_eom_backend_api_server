import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { diaryRouter } from "./v1/routes/diary_routes";
import { musicRouter } from "./v1/routes/music_routes";
import { authRouter } from "./v1/routes/auth_routes";
import { CustomHttpErrorModel } from "./models/custom_http_error_model";
import morgan from "morgan";
import { accessLogStream } from "./utils/log_utils";
import { PRODUCTION } from "./constant/default";
import cookieParser from "cookie-parser";
import { Redis } from "./redis/redis";

// 반복적으로 나오는 try catch나 에러 처리 같은 경우에는 express에 미들웨어를 통해 진행함
const server = async () => {
  const app = express();

  if (process.env.NODE_ENV === PRODUCTION) {
    app.use(
      morgan("combined", {
        stream: accessLogStream, // 배포 환경에서 combined 사용
        skip: function (req, res) {
          // 옵션으로 skip함수를 넣어 로그가 무거워지지 않도록 로깅의 스킵여부를 결정, 기본값은 false
          return res.statusCode < 400; // 정상적인 응답인 경우는 로그를 기록하지 않음 => 에러인 경우만 로그 기록
        },
      })
    );
  } else {
    app.use(morgan("dev"));
  }
  const {
    MONGO_URI,
    MONGO_URI_SUFFIX,
    NODE_ENV,
    PORT,
    COOKIE_SECRET,
    // REDIS_HOST,
    // REDIS_PORT,
  } = process.env;

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser(COOKIE_SECRET));
  // .env 파일 내에 있는 변수들을 불러옴
  // destructuring을 통해 변수를 불러옴

  // .env 파일 내에 있는 변수들이 없을 경우 에러를 던짐
  if (!MONGO_URI) throw new Error("MONGO_URI is required!!!");
  if (!PORT) throw new Error("PORT is required!!!");

  // mongoose를 통해 MongoDB에 연결
  await mongoose.connect(MONGO_URI + NODE_ENV + MONGO_URI_SUFFIX);
  // mongoose의 debug 모드를 활성화
  mongoose.set("debug", true);
  console.log("MongoDB connected");

  // redis를 통해 Redis에 연결
  await Redis.getInstance().connect();
  console.log("Redis connected");

  // express의 미들웨어를 통해 req.body를 사용할 수 있도록 함
  // 추가적으로 해당 체계는 routes -> controllers -> services -> repository로 이어짐
  // routes : middelware를 실행 시키며 req와 res를 받아 controller로 넘김
  // controller : 쿼리 혹은 body를 통해 받은 데이터를 내부에서 사용하는 class 형태로 변경하여 service로 넘김
  // service : 서비스 로직에 대한 부분을 담당하며 repository를 활용하여 CURD를 진행함
  // repository : DB에 접근하는 부분을 담당하며 mongoose를 통해 DB에 접근함
  app.use("/api/v1/diaries", diaryRouter);
  app.use("/api/v1/musics", musicRouter);
  app.use("/api/v1/auth", authRouter);

  // 404 에러를 처리하는 부분
  app.use((req, res, next) => {
    const error = new CustomHttpErrorModel({
      message: "Could not find this route.",
      status: 404,
    });
    next(error);
  });

  // 전체적 에러 처리 부분
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // err 가 httpErrorModel 이면 expected
    // err 가 httpErrorModel 이 아니면 unexpected
    console.error(
      new Date().toISOString() + ": " + (err instanceof CustomHttpErrorModel)
        ? ""
        : "un" + "expected npm log: " + err
    );
    return res.status(err.status || 500).json(
      NODE_ENV === PRODUCTION
        ? {}
        : {
            message: err.message || "An unknown error occurred!",
          }
    );
  });

  // 서버를 실행함
  app.listen(PORT, async () => {
    console.log(`server listening on port ${PORT}`);
  });
};

server();
