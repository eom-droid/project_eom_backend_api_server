import jwt from "jsonwebtoken";
import { TOKEN_EXPIRE_TIME, TokenType } from "../constant/default";
import { CustomHttpErrorModel } from "../models/custom_http_error_model";

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
  static verifyToken(token: string): customJwtPayload {
    try {
      const decodedCode = jwt.verify(token, process.env.JWT_SECRET_KEY!);
      const payload = new customJwtPayload(decodedCode as jwt.JwtPayload);
      // 1. 토큰 exp 검증
      if (!payload.exp) throw {};
      // 2. 토큰이 만료되었는지 검증
      if (payload.exp < Date.now() / 1000) {
        throw new CustomHttpErrorModel({
          status: 401,
          message: "토큰이 만료되었습니다.",
        });
      }
      return payload;
    } catch (error) {
      throw new CustomHttpErrorModel({
        status: 401,
        message: "토큰이 유효하지 않습니다.",
      });
    }
  }

  static createJwt(id: string, tokenType: string) {
    const token = jwt.sign(
      {
        id,
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
