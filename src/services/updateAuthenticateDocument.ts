import { DOCUMENTS_COLLECTION } from '../utils/constants';
import { db } from '../config';

export const updateAuthenticateDocument = async (documentId: string): Promise<{ success: boolean; message: string }> => {
  try {
    await db.collection(DOCUMENTS_COLLECTION).doc(documentId).update({
      isAuthenticated: true,
    });
    return {
      success: true,
      message: 'Documento autenticado con éxito',
    };
  } catch (error) {
    return {
      success: false,
      message: 'No fue posible autenticar el documento',
    };
  }
};
