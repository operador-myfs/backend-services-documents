import axios from 'axios';

export const unregisterCitizen = async (id: string) => {
  try {
    await axios.delete('https://govcarpeta-apis-83e1c996379d.herokuapp.com/apis/unregisterCitizen', {
      data: {
        id: parseInt(id),
        operatorId: '66cbab4e1ef5a300156cef1e',
        operatorName: 'Operador myfs',
      },
    });

    return {
      success: true,
      message: 'Ciudadano desregistrado de GovCarpeta',
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: 'Error al desregistrar de GovCarpeta',
    };
  }
};
