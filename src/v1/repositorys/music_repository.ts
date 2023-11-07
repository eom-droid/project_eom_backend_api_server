import { MusicPaginateReqModel } from "../../models/music_paginate_req_model";
import { Music, MusicModel } from "../models/music_model";

/**
 * @DESC create new music
 * 자체적인 musicModel을 mongoDB musicModel로 변환함
 * mongoDB에 새로운 music을 생성함
 * @RETURN music
 */
export const createMusic = async (music: Music) => {
  try {
    const musicInstance = music.toMusicModel();

    const savedMusic = await musicInstance.save();
    return savedMusic;
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC get musics
 * 최신순으로 정렬하여 특정 갯수만큼의 music을 가져옴
 * @RETURN musics
 */
export const getMusics = async (paginateReq: MusicPaginateReqModel) => {
  try {
    var filterQuery = paginateReq.generateQuery();

    return await MusicModel.find(filterQuery)
      .sort({ createdAt: -1 })
      .limit(paginateReq.count);
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC get one music
 * 특정 music을 가져옴
 */

export const getMusic = async (id: string) => {
  try {
    return await MusicModel.findById(id);
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC update music
 * music 업데이트
 */
export const updateMusic = async (id: String, music: Music) => {
  try {
    const updatedMusic = await MusicModel.updateOne(
      { _id: id },
      music.toJson()
    );
    return updatedMusic;
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC delete music
 * music 삭제
 */
export const deleteMusic = async (id: String) => {
  try {
    const deletedMusic = await MusicModel.deleteOne({ _id: id });
    return deletedMusic;
  } catch (error) {
    throw error;
  }
};
