export const PAGINATE_LIMIT = 10;
export const PAGINATE_COUNT_DEFAULT = 10;

export const DIARY = "diary";
export const MUSIC = "music";
export const USER = "user";

export const S3AlbumCoverPath =
  "eom/" + process.env.NODE_ENV + "/music/albumCover/";
export const S3DiaryPath = "eom/" + process.env.NODE_ENV + "/diary/";
export const S3UserProfilePath =
  "eom/" + process.env.NODE_ENV + "/user/profile/";

export const ProviderType = {
  KAKAO: "kakao",
  GOOGLE: "google",
  NAVER: "naver",
  APPLE: "apple",
} as const;
export type ProviderType = (typeof ProviderType)[keyof typeof ProviderType];

export const RoleType = {
  USER: 0,
  MANAGER: 5,
  ADMIN: 10,
} as const;

export type RoleType = (typeof RoleType)[keyof typeof RoleType];
export const numberToRoleType = (num: number) => {
  switch (num) {
    case 0:
      return RoleType.USER;
    case 5:
      return RoleType.MANAGER;
    case 10:
      return RoleType.ADMIN;
    default:
      return RoleType.USER;
  }
};

export const TokenType = {
  ACCESS: "access",
  REFRESH: "refresh",
} as const;

export type TokenType = (typeof TokenType)[keyof typeof TokenType];

export const DataPassType = {
  PARAMS: "params",
  BODY: "body",
  QUERY: "query",
} as const;

export type DataPassType = (typeof DataPassType)[keyof typeof DataPassType];

export const PRODUCTION = "production";
export const DEVELOPMENT = "development";

export const TOKEN_EXPIRE_TIME = {
  ACCESS: "1h",
  REFRESH: "30d",
};

export const CookieOption = {
  httpOnly: true,
  secure: true,
};

export const SaltOrRounds = 10;
