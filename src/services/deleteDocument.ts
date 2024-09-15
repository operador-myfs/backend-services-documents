import { DOCUMENTS_COLLECTION } from '../utils/constants';
import { db } from '../config';
import { IDocument } from '../types/document.types';

export const deleteDocument = async (
  id: string,
  uid: string
): Promise<{ success: boolean; message: string; status: number; key: string }> => {
  try {
    const snapshot = await db.collection(DOCUMENTS_COLLECTION).where('uid', '==', uid).where('id', '==', id).get();
    if (!snapshot.empty) {
      const document = snapshot.docs[0].data() as IDocument;
      await db.collection(DOCUMENTS_COLLECTION).doc(id).delete();
      return {
        success: true,
        message: `Document ${id} deleted successfully.`,
        status: 200,
        key: document.key,
      };
    } else {
      return {
        success: false,
        message: 'Document does not exist',
        status: 404,
        key: '',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Document ${id} could not be deleted.`,
      status: 500,
      key: '',
    };
  }
};
