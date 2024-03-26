import { Response } from "express";
import { v4 as uuidv4 } from "uuid";

interface ICustomError {
  error: any;
  res: Response;
}

export class DataUtils {
  static errorHandle({ error, res }: ICustomError) {
    let message = "Unknown Error";
    if (error instanceof Error) message = error.message;
    // 진행은 하겠지만, 리포트는 전송하자.
    reportError({ message });
  }

  static generateFileName() {
    const today = new Date();
    const year = today.getFullYear().toString().substring(2, 4);
    const month = today.getMonth() + 1;
    const date = today.getDate();

    const fileName = `${year}${month >= 10 ? month : "0" + month}${
      date >= 10 ? date : "0" + date
    }_${uuidv4()}`;

    console.log(fileName);

    return fileName;
  }

  static isImageFile(fileName: string) {
    const imageFileExtension = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "JPG",
      "JPEG",
      "PNG",
      "GIF",
      "BMP",
    ];
    const fileExtension = fileName.split(".").pop();

    if (fileExtension && imageFileExtension.includes(fileExtension)) {
      return true;
    } else {
      return false;
    }
  }
  static isVideoFile(fileName: string) {
    const videoFileExtension = [
      "mp4",
      "MP4",
      "avi",
      "AVI",
      "wmv",
      "WMV",
      "mov",
      "MOV",
    ];
    const fileExtension = fileName.split(".").pop();

    if (fileExtension && videoFileExtension.includes(fileExtension)) {
      return true;
    } else {
      return false;
    }
  }
}

export function errorHandle(error: any) {}
