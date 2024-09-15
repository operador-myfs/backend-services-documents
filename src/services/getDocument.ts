import { DOCUMENTS_COLLECTION } from '../utils/constants';
import { db } from '../config';
import { IDocument } from '../types/document.types';

export const getDocument = async (
  id: string,
  uid: string
): Promise<{ success: boolean; message: string; status: number; doc: IDocument | null }> => {
  try {
    const snapshot = await db.collection(DOCUMENTS_COLLECTION).where('uid', '==', uid).where('id', '==', id).get();
    if (!snapshot.empty) {
      return {
        success: true,
        message: '',
        status: 200,
        doc: snapshot.docs[0].data() as IDocument,
      };
    } else {
      return {
        success: false,
        message: 'Document does not exist',
        status: 404,
        doc: null,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error when find document',
      status: 500,
      doc: null,
    };
  }
};
