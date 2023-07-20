import {
  PutObjectCommand,
  S3Client,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { DataUtils } from "./data_util";

const s3 = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});
export class AWSUtils {
  /**
   * @DESC delete files from s3
   * s3에 있는 파일을 삭제함
   */
  static deleteFileFromS3 = async ({ files }: { files: string[] }) => {
    await Promise.all(
      files.map(async (element: string) => {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: element,
          })
        );
      })
    );
  };

  /**
   * @DESC upload file/files to s3
   * 파일을 image/video에서 선택해서 s3에 업로드함
   */
  // 자동적으로 image / video 폴더를 만들어서 업로드함
  static uploadFileToS3 = async ({
    file,
    // 맨뒤에 /를 넣어줘야됨
    s3Path,
  }: {
    file: Express.Multer.File | Express.Multer.File[];
    s3Path: string;
  }): Promise<Express.Multer.File[] | Express.Multer.File> => {
    var tempFile;
    if (file instanceof Array) {
      tempFile = file;
    } else {
      tempFile = [file];
    }

    await Promise.all(
      tempFile.map(async (element: Express.Multer.File) => {
        const fileExtension = element.originalname.split(".").pop();
        const directory =
          s3Path +
          (DataUtils.isImageFile(element.originalname) ? "image/" : "video/");
        const fileName =
          directory + DataUtils.generateFileName() + "." + fileExtension;
        element.filename = fileName;
        return s3.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: fileName,
            Body: element.buffer,
          })
        );
      })
    );
    if (tempFile.length === 1) return tempFile[0];
    return tempFile;
  };
}
