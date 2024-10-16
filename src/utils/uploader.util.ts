import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';
import { cloudinary } from '../config';

export const uploader = (
  file: Express.Multer.File,
): Promise<UploadApiResponse | UploadApiErrorResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      (error: any, result: any) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      },
    );
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};
