import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../config';
import { AWS_BUCKET } from '../utils/constants';

export const uploadFileToS3 = async (
  uid: string,
  file: Express.Multer.File,
  key: string
): Promise<{ success: boolean; message: string }> => {
  const bucketName = AWS_BUCKET;

  const params = {
    Bucket: bucketName,
    Key: `${uid}/${key}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    await s3.send(new PutObjectCommand(params));
    return {
      success: true,
      message: 'File uploaded successfully',
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      message: 'Failed to upload file',
    };
  }
};
