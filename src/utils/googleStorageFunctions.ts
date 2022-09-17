import fs from "fs";
import sharp from "sharp";
import { createWriteStream as yazdir } from "fs";
import { path } from "app-root-path";
import { Storage } from "@google-cloud/storage";
import { FileUpload } from "graphql-upload";
import generateSlug from "./generateSlug";

const bucketName = "";
const googleStorageOptions = `${path}/gcs.json`;
const fileLocalPath = `${path}/public/img/`;

const storage = new Storage({
  keyFilename: googleStorageOptions,
  projectId: bucketName,
});

export const uploadGoogleStorageImage = async (file: FileUpload) => {
  const fileType = file.mimetype;
  const bucket = storage.bucket(bucketName);
  const getExtension = file.filename.split(".");
  const extension = getExtension[getExtension.length - 1];
  const fileName = `${new Date().getTime()}-${generateSlug(
    file.filename.replace(extension, "")
  )}.${extension}`;
  const splitFileName = fileType.split("/");

  const writeFile = (file: FileUpload) => {
    return new Promise((resolve, reject) => {
      file
        .createReadStream()
        .pipe(yazdir(`${fileLocalPath}/${fileName}`))
        .on("close", () => {
          resolve("ok");
        })
        .on("error", (err) => {
          reject(`writeFile err: ${err.message}`);
        });
    });
  };

  const singleUpload = (
    originalFileName: string,
    fileName: string,
    folderName: string
  ) => {
    return new Promise((resolve, reject) => {
      const localReadStream = fs.createReadStream(
        `${fileLocalPath}/${fileName}`
      );
      const remoteWriteStream = bucket
        .file(`${folderName}/${originalFileName}`)
        .createWriteStream();
      localReadStream
        .pipe(remoteWriteStream)
        .on("finish", () => {
          resolve({ status: "OK" });
        })
        .on("error", (err) => {
          reject({ status: `singleUpload err: ${err.message}` });
        });
    });
  };

  const resizeImage = (
    width: number | undefined,
    height: number | undefined,
    folderName: string
  ) => {
    let setFolderName = folderName;

    if (!folderName) {
      setFolderName = `${width}x${height}`;
    }

    return new Promise((resolve, reject) => {
      sharp(`${fileLocalPath}/${fileName}`)
        .resize({
          width: width === 0 ? undefined : width,
          height: height === 0 ? undefined : height,
        })
        .withMetadata()
        .toFile(`${fileLocalPath}/${width}x${height}-${fileName}`)
        .then(() => {
          singleUpload(
            fileName,
            `${width}x${height}-${fileName}`,
            setFolderName
          )
            .then(() => resolve("ok"))
            .catch((err) => reject(err));
        })
        .catch((err) => {
          console.log(`resizeImage err: ${err.message}`);
        });
    });
  };

  await writeFile(file);

  if (splitFileName[0] !== "image") {
    await singleUpload(fileName, fileName, "files");
  } else {
    await Promise.all([
      resizeImage(150, 150, "thumbs"),
      resizeImage(776, 300, "question"),
      resizeImage(1120, 0, "page"),
    ]);
  }
  return {
    status: "success",
    fileName,
    fileType,
    // fileSize: 0,
    order: 99,
  };
};
