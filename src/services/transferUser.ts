import axios from 'axios';
import { IDocument } from '../types/document.types';
import { IDocumentUrl } from './getDocumentsUrl';

interface TTransferCitizen {
  id: number;
  citizenName: string;
  citizenEmail: string;
  Documents: Record<string, Array<string>>;
  confirmationURL: string;
}

export const transferUser = async (
  uid: string,
  citizenName: string,
  citizenEmail: string,
  documents: IDocumentUrl[],
  transferAPIURL: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const Documents: TTransferCitizen['Documents'] = {};

    documents.forEach(doc => {
      Documents[doc.fileName] = [doc.url];
    });

    // TODO cambiar confirmationURL
    const body: TTransferCitizen = {
      id: parseInt(uid),
      citizenName,
      citizenEmail,
      Documents,
      confirmationURL: 'https://ocrf9nzqde.execute-api.us-east-1.amazonaws.com/prod/interoperabilidad/api/confirmTransfer',
    };

    await axios.post(transferAPIURL, { ...body });

    return {
      success: true,
      message: 'Solicitud de transferencia enviada',
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: 'No fue posible transferir usuarios',
    };
  }
};
