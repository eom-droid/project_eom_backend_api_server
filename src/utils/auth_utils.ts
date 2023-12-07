import jwt from "jsonwebtoken";
import { TOKEN_EXPIRE_TIME, TokenType } from "../constant/default";
import { CustomHttpErrorModel } from "../models/custom_http_error_model";
import { EncryptUtils } from "./encrypt_utils";
import { Redis } from "../redis/redis";

export class customJwtPayload implements jwt.JwtPayload {
  id: string;
  tokenType: string;
  exp?: number | undefined;
  iat?: number | undefined;

  constructor(token: jwt.JwtPayload) {
    this.id = token.id;
    this.tokenType = token.tokenType;
    this.exp = token.exp;
    this.iat = token.iat;
  }
}

export class AuthUtils {
  static async verifyRefreshToken(token: string): Promise<customJwtPayload> {
    try {
      // 1. 기본적인 토큰 검증
      const payload = this.verifyToken(token);
      // 2. 토큰 타입 검증
      if (payload.tokenType !== TokenType.REFRESH)
        throw new CustomHttpErrorModel({
          status: 401,
          message: "Refresh 토큰이 아닙니다.",
        });
      // 3. redis에 저장된 토큰 검증
      const redisToken = await Redis.getInstance().get(payload.id);
      if (redisToken !== token) {
        // 해킹 의심 -> 해당 토큰 삭제
        throw new CustomHttpErrorModel({
          status: 401,
          message: "토큰이 유효하지 않습니다.",
        });
      }
      return payload;
    } catch (error) {
      // CustomHttpErrorModel은 이미 에러를 던져줌
      if (error instanceof CustomHttpErrorModel) {
        // redis에 저장된 토큰 삭제
        const decodedToken = this.decodeToken(token);
        if (decodedToken?.id) await Redis.getInstance().del(decodedToken.id);
        throw error;
      }
      // 그 외의 에러는 CustomHttpErrorModel로 던져줌
      throw new CustomHttpErrorModel({
        status: 401,
        message: "토큰이 유효하지 않습니다.",
      });
    }
  }

  static verifyAccessToken(token: string): customJwtPayload {
    const payload = this.verifyToken(token);
    if (payload.tokenType !== TokenType.ACCESS) {
      throw new CustomHttpErrorModel({
        status: 401,
        message: "Access 토큰이 아닙니다.",
      });
    }
    return payload;
  }

  static verifyToken(token: string): customJwtPayload {
    try {
      const decodedCode = jwt.verify(token, process.env.JWT_SECRET_KEY!);
      const payload = new customJwtPayload(decodedCode as jwt.JwtPayload);
      // 1. 토큰 exp 검증
      if (!payload.exp)
        throw new CustomHttpErrorModel({
          status: 401,
          message: "토큰이 만료되었습니다.",
        });
      // 2. 토큰이 만료되었는지 검증
      if (payload.exp < Date.now() / 1000) {
        throw new CustomHttpErrorModel({
          status: 401,
          message: "토큰이 만료되었습니다.",
        });
      }
      // payload id 복호화 진행
      payload.id = EncryptUtils.decryptWithAES256(payload.id);
      return payload;
    } catch (error) {
      if (error instanceof CustomHttpErrorModel) throw error;
      throw new CustomHttpErrorModel({
        status: 401,
        message: "토큰이 유효하지 않습니다.",
      });
    }
  }

  private static decodeToken(token: string): customJwtPayload | null {
    const decodedCode = jwt.decode(token);
    if (decodedCode === null || typeof decodedCode === "string") return null;
    const payload = new customJwtPayload(decodedCode as jwt.JwtPayload);
    // payload id 복호화 진행
    payload.id = EncryptUtils.decryptWithAES256(payload.id);
    return payload;
  }

  static async createRefreshToken(id: string) {
    const token = this.createJwt(id, TokenType.REFRESH);
    await Redis.getInstance().set(id, token);
    return token;
  }

  static createAccessToken(id: string) {
    return this.createJwt(id, TokenType.ACCESS);
  }

  static splitBaererToken(token: string) {
    const splitToken = token.split(" ");

    if (splitToken.length !== 2 || splitToken[0] !== "Bearer") {
      throw new CustomHttpErrorModel({
        status: 401,
        message: "토큰이 유효하지 않습니다.",
      });
    }
    return splitToken[1];
  }

  private static createJwt(id: string, tokenType: string) {
    // payload id 암호화 진행
    const encryptId = EncryptUtils.encryptWithAES256(id);
    const token = jwt.sign(
      {
        id: encryptId,
        tokenType,
      },
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn:
          tokenType === TokenType.ACCESS
            ? TOKEN_EXPIRE_TIME.ACCESS
            : TOKEN_EXPIRE_TIME.REFRESH,
      }
    );

    return token;
  }
}
