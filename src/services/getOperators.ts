import axios from 'axios';

export const getOperators = async (): Promise<{ success: boolean; operators: any }> => {
  try {
    const res = await axios.get('https://govcarpeta-apis-83e1c996379d.herokuapp.com/apis/getOperators');
    return {
      success: true,
      operators: res.data,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      operators: null,
    };
  }
};
