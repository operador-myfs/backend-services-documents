import { IDocument } from '../types/document.types';
import { getPresignedUrl } from './getPresignedUrl';

export interface IDocumentUrl extends IDocument {
  url: string;
}

export const getDocumentsUrl = async (
  uid: string,
  documents: IDocument[]
): Promise<{ success: boolean; message: string; documents: IDocumentUrl[] }> => {
  const responses = await Promise.all(documents.map(doc => getPresignedUrl(`${uid}/${doc.key}`)));
  if (responses.some(res => !res.success)) {
    return {
      success: false,
      message: 'No fue posible obtener url de documentos',
      documents: [],
    };
  }

  const docsWithUrl: IDocumentUrl[] = documents.map((doc, idx) => ({
    ...doc,
    url: responses[idx].url,
  }));

  return {
    success: true,
    message: 'Urls obtenidas con éxito',
    documents: docsWithUrl,
  };
};
