import { S3AlbumCoverPath } from "../../constant/default";
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
      s3Path: S3AlbumCoverPath,
      file: albumCover,
    });
    music.albumCover =
      uploadCompleteFile instanceof Array
        ? uploadCompleteFile[0].filename
        : uploadCompleteFile.filename;
    return await musicRepository.createMusic(music);
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC update music
 * music을 patch함 albumCover와 함께 전송될 경우 해당 파일을 저장함
 * 파일 업로드와 이름 매칭을 진행함
 * 기존 파일중에서 삭제된 파일이 있다면 s3에서 삭제함
 * @RETURN music
 */

export const updateMusic = async (
  id: string,
  music: Music,
  albumCover: Express.Multer.File | undefined
) => {
  try {
    const oldMusic = await musicRepository.getMusic(id);

    if (oldMusic === null) {
      throw { status: 400, message: "값이 존재하지 않습니다." };
    }

    if (albumCover !== undefined) {
      const uploadCompleteFile = await AWSUtils.uploadFileToS3({
        s3Path: S3AlbumCoverPath,
        file: albumCover,
      });
      music.albumCover =
        uploadCompleteFile instanceof Array
          ? uploadCompleteFile[0].filename
          : uploadCompleteFile.filename;

      // 기존파일 삭제
      await AWSUtils.deleteFileFromS3({
        files: [oldMusic.albumCover],
      });
    }

    return await musicRepository.updateMusic(id, music);
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC delete music
 * music을 삭제함
 * music에 albumCover가 존재할 경우 s3에서 삭제함
 */
export const deleteMusic = async (id: string) => {
  try {
    const music = await musicRepository.getMusic(id);

    if (music === null) {
      throw { status: 400, message: "값이 존재하지 않습니다." };
    }

    if (music.albumCover !== undefined) {
      await AWSUtils.deleteFileFromS3({
        files: [music.albumCover],
      });
    }

    return await musicRepository.deleteMusic(id);
  } catch (error: any) {
    throw error;
  }
};
