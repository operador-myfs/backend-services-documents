import { DOCUMENTS_COLLECTION } from '../utils/constants';
import { db } from '../config';
import { IDocument } from '../types/document.types';

export const saveDocToDB = async (
  uid: string,
  key: string,
  fileName: string
): Promise<{ success: boolean; message: string; doc?: IDocument }> => {
  try {
    const docRef = db.collection(DOCUMENTS_COLLECTION).doc();
    const newDoc: IDocument = {
      id: docRef.id,
      createdAt: Date.now(),
      isAuthenticated: false,
      uid,
      fileName,
      key,
    };

    await docRef.set(newDoc);

    return {
      success: true,
      message: 'document saved successfully',
      doc: newDoc,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error when saving document',
    };
  }
};
