import { Request, Response, NextFunction } from "express";
import { PaginateReqModel } from "../../models/paginate_req_model";
import * as musicService from "../services/music_service";
import { jsonToMusic } from "../models/music_model";
import { CustomHttpErrorModel } from "../../models/custom_http_error_model";

/**
 * @DESC get musics
 * @RETURN musics
 */
export const getMusics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paginateReq = new PaginateReqModel(req.query);

    const data = await musicService.getMusics(paginateReq);

    return res.status(200).send(data);
  } catch (error: any) {
    next(error);
  }
};

/**
 * @DESC create new musics
 * @RETURN musics
 */
export const createNewMusics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const music = jsonToMusic(req.body);
    var file = req.files;
    if (file === undefined)
      throw new CustomHttpErrorModel({
        status: 400,
        message: "file is undefined",
      });
    file = file as Express.Multer.File[];

    var data = await musicService.createMusic(music, file[0]);
    return res.status(201).send({ status: "OK", data: data });
  } catch (error: any) {
    next(error);
  }
};

/**
 * @DESC update music
 * @RETURN music
 */
export const updateMusic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const music = jsonToMusic(req.body);
    console.log(music);

    var data = await musicService.updateMusic(
      req.params.id,
      music,
      req.files !== undefined
        ? (req.files as Express.Multer.File[])[0]
        : undefined
    );

    return res.status(201).send({ status: "OK", data: data });
  } catch (error: any) {
    next(error);
  }
};

/**
 * @DESC delete music
 * @RETURN music
 */

export const deleteMusic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    var data = await musicService.deleteMusic(id);

    return res.status(200).send({ status: "SUCCESS" });
  } catch (error: any) {
    next(error);
  }
};
