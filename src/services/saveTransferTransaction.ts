import { TRANSFER_COLLECTION } from '../utils/constants';
import { db } from '../config';
import { ITransferTransaction } from '../types/transfer.types';
import { TTransferCitizen } from '../schemas/transferCitizen';

export const saveTransferTransaction = async (
  data: TTransferCitizen
): Promise<{ success: boolean; message: string; doc?: ITransferTransaction }> => {
  try {
    const documents: ITransferTransaction['documents'] = {};

    for (const key in data.urlDocuments) {
      if (Object.prototype.hasOwnProperty.call(data.urlDocuments, key)) {
        const document = data.urlDocuments[key];
        documents[key] = {
          state: 'pending',
          url: document[0],
        };
      }
    }

    const docRef = db.collection(TRANSFER_COLLECTION).doc();
    const newDoc: ITransferTransaction = {
      transactionId: docRef.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      id: data.id,
      citizenEmail: data.citizenEmail,
      citizenName: data.citizenName,
      confirmationURL: data.confirmationURL,
      documents,
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
