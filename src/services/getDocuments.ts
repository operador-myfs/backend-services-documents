import { DOCUMENTS_COLLECTION } from '../utils/constants';
import { db } from '../config';
import { IDocument } from '../types/document.types';

export const getDocuments = async (uid: string): Promise<{ success: boolean; message: string; docs: IDocument[] }> => {
  try {
    let docs: IDocument[] = [];

    const snapshot = await db.collection(DOCUMENTS_COLLECTION).where('uid', '==', uid).get();
    if (!snapshot.empty) {
      snapshot.forEach(doc => docs.push(doc.data() as IDocument));
    }

    return {
      success: true,
      message: '',
      docs,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: 'Error when list documents',
      docs: [],
    };
  }
};
