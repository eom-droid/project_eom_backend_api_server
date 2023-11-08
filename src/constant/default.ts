export const PAGINATE_LIMIT = 20;
export const PAGINATE_COUNT_DEFAULT = 10;

export const DIARY = "diary";
export const MUSIC = "music";

export const S3AlbumCoverPath = "eom/music/albumCover/";

export const ProviderType = {
  KAKAO: "kakao",
  GOOGLE: "google",
} as const;

export type ProviderType = (typeof ProviderType)[keyof typeof ProviderType];

export const TokenType = {
  ACCESS: "access",
  REFRESH: "refresh",
} as const;

export type TokenType = (typeof TokenType)[keyof typeof TokenType];

export const PRODUCTION = "production";
export const DEVELOPMENT = "development";

export const TOKEN_EXPIRE_TIME = {
  ACCESS: "1h",
  REFRESH: "30d",
};
