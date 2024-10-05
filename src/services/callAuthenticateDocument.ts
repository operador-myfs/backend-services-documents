import axios from 'axios';

export const callAuthenticateDocument = async (
  idCitizen: number,
  UrlDocument: string,
  documentTitle: string
): Promise<{ success: boolean; message: string }> => {
  try {
    await axios.put('https://govcarpeta-apis-83e1c996379d.herokuapp.com/apis/authenticateDocument', {
      idCitizen,
      UrlDocument,
      documentTitle,
    });
    return {
      success: true,
      message: 'Documento autenticado con éxito',
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: 'No fue posible autenticar el documento',
    };
  }
};
