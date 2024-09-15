import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from '../config';
import { AWS_BUCKET } from '../utils/constants';

export const getPresignedUrl = async (key: string): Promise<{ success: boolean; message: string; url: string }> => {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET,
    Key: key,
  });

  try {
    // Generar URL prefirmada con tiempo de expiración especificado
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return {
      success: true,
      message: '',
      url,
    };
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    return {
      success: false,
      message: 'Failed to generate pre-signed URL',
      url: '',
    };
  }
};
