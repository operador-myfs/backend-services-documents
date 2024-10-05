import { Request, Response } from 'express';
import response from '../utils/response';
import { uploadFileToS3 } from '../services/uploadFileToS3';
import { saveDocToDB } from '../services/saveDocToDB';
import { getDocuments } from '../services/getDocuments';
import { getDocument } from '../services/getDocument';
import { getPresignedUrl } from '../services/getPresignedUrl';
import { deleteDocument } from '../services/deleteDocument';
import { deleteFileFromS3 } from '../services/deleteFileFromS3';
import { getOperators } from '../services/getOperators';
import { callAuthenticateDocument } from '../services/callAuthenticateDocument';
import { updateAuthenticateDocument } from '../services/updateAuthenticateDocument';
import transferSchema from '../schemas/transfer';
import { getDocumentsUrl } from '../services/getDocumentsUrl';
import { transferUser } from '../services/transferUser';

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

const authenticateDocument = async (req: Request, res: Response) => {
  const { success: successDocument, message: messageDocument, status, doc } = await getDocument(req.params.id, req.body.uid);
  if (!successDocument) {
    return response({
      res,
      status,
      error: true,
      message: messageDocument,
    });
  }

  const { success: successUrl, message: messageUrl, url } = await getPresignedUrl(`${req.body.uid}/${req.params.key}`);
  if (!successUrl) {
    return response({
      res,
      status: 500,
      error: true,
      message: messageUrl,
    });
  }

  const { success: successCall, message: messageCall } = await callAuthenticateDocument(parseInt(req.body.uid), url, doc.fileName);
  if (!successCall) {
    return response({
      res,
      status: 500,
      error: true,
      message: messageCall,
    });
  }

  const { success: successUpdateDoc, message: messageUpdateDoc } = await updateAuthenticateDocument(doc.id);
  if (successUpdateDoc) {
    return response({
      res,
      status: 200,
      error: false,
      message: messageUpdateDoc,
    });
  } else {
    return response({
      res,
      status: 500,
      error: true,
      message: messageUpdateDoc,
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

const getOperatorsList = async (req: Request, res: Response) => {
  const { success, operators } = await getOperators();
  if (success) {
    return response({
      res,
      status: 200,
      error: false,
      message: '',
      body: operators,
    });
  } else {
    return response({
      res,
      status: 500,
      error: true,
      message: 'Error al obtener operadores',
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

const transfer = async (req: Request, res: Response) => {
  const result = transferSchema.validateTransfer(req.body);
  if (result.success === false) {
    return response({
      res,
      status: 400,
      error: true,
      message: JSON.parse(result.error.message),
    });
  }

  const { success: successDocument, message: messageDocument, docs } = await getDocuments(req.body.uid);
  if (!successDocument) {
    return response({
      res,
      status: 500,
      error: true,
      message: messageDocument,
    });
  }

  const { success: successUrls, message: messageUrls, documents } = await getDocumentsUrl(req.body.uid, docs);
  if (!successUrls) {
    return response({
      res,
      status: 500,
      error: true,
      message: messageUrls,
    });
  }

  const { success: successTransfer, message: messageTransfer } = await transferUser(
    req.body.uid,
    req.body.name,
    req.body.email,
    documents,
    result.data.transferAPIURL
  );
  if (successTransfer) {
    return response({
      res,
      status: 200,
      error: false,
      message: messageTransfer,
    });
  } else {
    return response({
      res,
      status: 500,
      error: true,
      message: messageTransfer,
    });
  }
};

const documentController = {
  healthcheck,
  getDocumentById,
  authenticateDocument,
  deleteDocumentById,
  getDocumentsByUser,
  getDocumentUrl,
  uploadFile,
  getOperatorsList,
  transfer,
};

export default documentController;
