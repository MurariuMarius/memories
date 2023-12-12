import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const authenticate = (formData, router, action) => async (dispatch) => {
  try {
    const { data } = await action(formData);
    
    dispatch({ type: AUTH, data });

    router.push('/');
  } catch (error) {
    console.log(error);
  }
};

