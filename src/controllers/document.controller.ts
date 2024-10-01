import { Request, Response } from 'express';
import response from '../utils/response';
import { uploadFileToS3 } from '../services/uploadFileToS3';
import { saveDocToDB } from '../services/saveDocToDB';
import { getDocuments } from '../services/getDocuments';
import { getDocument } from '../services/getDocument';
import { getPresignedUrl } from '../services/getPresignedUrl';
import { deleteDocument } from '../services/deleteDocument';
import { deleteFileFromS3 } from '../services/deleteFileFromS3';

const healthcheck = async (_req: Request, res: Response) => {
  return response({
    res,
    status: 200,
    error: false,
    message: 'healthy',
  });
};

const getDocumentsByUser = async (req: Request, res: Response) => {
  const { success, message, docs } = await getDocuments(req.body.uid);
  if (success) {
    return response({
      res,
      status: 200,
      error: false,
      message: message,
      body: docs,
    });
  } else {
    return response({
      res,
      status: 500,
      error: true,
      message: message,
    });
  }
};

const getDocumentById = async (req: Request, res: Response) => {
  const { success, message, status, doc } = await getDocument(req.params.id, req.body.uid);
  if (success) {
    return response({
      res,
      status,
      error: false,
      message: message,
      body: doc,
    });
  } else {
    return response({
      res,
      status,
      error: true,
      message: message,
    });
  }
};

const deleteDocumentById = async (req: Request, res: Response) => {
  const { success: success1, message: message1, status, key } = await deleteDocument(req.params.id, req.body.uid);
  if (!success1) {
    return response({
      res,
      status,
      error: true,
      message: message1,
    });
  }

  const { success: success2, message: message2 } = await deleteFileFromS3(req.body.uid, key);
  if (success2) {
    return response({
      res,
      status: 200,
      error: false,
      message: message2,
    });
  } else {
    return response({
      res,
      status: 500,
      error: true,
      message: message2,
    });
  }
};

const getDocumentUrl = async (req: Request, res: Response) => {
  const { success, message, url } = await getPresignedUrl(`${req.body.uid}/${req.params.key}`);
  if (success) {
    return response({
      res,
      status: 200,
      error: false,
      message: message,
      body: url,
    });
  } else {
    return response({
      res,
      status: 500,
      error: true,
      message: message,
    });
  }
};

const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) {
    return response({
      res,
      status: 400,
      error: true,
      message: 'no file to upload',
    });
  }

  const key = `${Date.now()}-${req.file.originalname.trim().replaceAll(' ', '+')}`;
  const { success: success1, message: message1, doc } = await saveDocToDB(req.body.uid, key, req.file.originalname);
  if (!success1) {
    return response({
      res,
      status: 500,
      error: true,
      message: message1,
    });
  }

  const { success: success2, message: message2 } = await uploadFileToS3(req.body.uid, req.file, key);
  if (success2) {
    return response({
      res,
      status: 200,
      error: false,
      message: message2,
      body: doc,
    });
  } else {
    return response({
      res,
      status: 500,
      error: true,
      message: message2,
    });
  }
};

const documentController = {
  healthcheck,
  getDocumentById,
  deleteDocumentById,
  getDocumentsByUser,
  getDocumentUrl,
  uploadFile,
};

export default documentController;
