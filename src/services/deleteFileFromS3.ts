import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../config';
import { AWS_BUCKET } from '../utils/constants';

export const deleteFileFromS3 = async (uid: string, key: string): Promise<{ success: boolean; message: string }> => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: AWS_BUCKET,
      Key: `${uid}/${key}`,
    });

    await s3.send(command);
    return {
      success: true,
      message: `File ${key} deleted successfully.`,
    };
  } catch (error) {
    console.error(`Error al eliminar el archivo ${key}:`, error);
    return {
      success: true,
      message: `File ${key} could not be deleted.`,
    };
  }
};
