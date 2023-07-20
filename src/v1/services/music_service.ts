import { MusicPaginateReqModel } from "../../models/music_paginate_req_model";
import { PaginateReturnModel } from "../../models/paginate_res_model";
import { AWSUtils } from "../../utils/aws_utils";
import { IMusic, Music } from "../models/music_model";

import * as musicRepository from "../repositorys/music_repository";

/**
 * @DESC get musics
 * @RETURN musics
 */
export const getMusics = async (
  paginateReq: MusicPaginateReqModel
): Promise<PaginateReturnModel<IMusic>> => {
  const result = (await musicRepository.getMusics(paginateReq)) as IMusic[];

  return new PaginateReturnModel<IMusic>({
    meta: {
      count: result.length,
      hasMore: result.length === paginateReq.count,
    },
    data: result,
  });
};

/**
 * @DESC create new musics
 * @RETURN musics
 * albumCover를 s3에 업로드하고, music을 생성함
 */
export const createMusic = async (
  music: Music,
  albumCover: Express.Multer.File
) => {
  try {
    const uploadCompleteFile = await AWSUtils.uploadFileToS3({
      s3Path: "eom/music/albumCover/",
      file: albumCover,
    });
    music.albumCover =
      uploadCompleteFile instanceof Array
        ? uploadCompleteFile[0].filename
        : uploadCompleteFile.filename;
    return await musicRepository.createMusic(music);
  } catch (error: any) {
    console.log(new Date().toISOString() + ": npm log: " + error);

    throw { status: error?.status || 400, message: error?.message || error };
  }
};
