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

  // 자동적으로 image / video 폴더를 만들어서 업로드함
  static uploadFileToS3 = async ({
    file,
    // 맨뒤에 /를 넣어줘야됨
    s3Path,
  }: {
    file: Express.Multer.File | Express.Multer.File[];
    s3Path: string;
  }) => {
    if (file instanceof Array) {
      await Promise.all(
        file.map(async (element: Express.Multer.File) => {
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
      return file;
    } else {
      const fileExtension = file.originalname.split(".").pop();
      const directory =
        s3Path +
        (DataUtils.isImageFile(file.originalname) ? "image/" : "video/");
      const fileName =
        directory + DataUtils.generateFileName() + "." + fileExtension;
      file.filename = fileName;
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: fileName,
          Body: file.buffer,
        })
      );
      return [file];
    }
  };
}
