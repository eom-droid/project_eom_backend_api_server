import { MusicPaginateReqModel } from "../../models/music_paginate_req_model";
import { Music, MusicModel } from "../models/music_model";

export const createMusic = async (music: Music) => {
  try {
    const musicInstance = music.toMusicModel();

    const savedMusic = await musicInstance.save();
    return savedMusic;
  } catch (e: any) {
    console.log(e);
    throw { status: 400, message: "입력값이 유효하지 않습니다." };
  }
};

export const getMusics = async (paginateReq: MusicPaginateReqModel) => {
  try {
    var filterQuery = paginateReq.generateQuery();

    return await MusicModel.find(filterQuery)
      .sort({ createdAt: -1 })
      .limit(paginateReq.count);
  } catch (e) {
    throw { status: 400, message: "값이 존재하지 않습니다." };
  }
};
