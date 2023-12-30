import { FETCH_ALL, CREATE, UPDATE, DELETE, LIKE } from '../constants/actionTypes';
import * as api from '../api/index.js';
import { firestoreService } from '../firebase/config.js';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';

export const getPosts = () => async (dispatch) => {
  try {
    const posts = [];
    const data = await getDocs(collection(firestoreService, "posts"));
    data.forEach((doc) => {
      posts.push({id: doc.id, ...doc.data()});
    })

    console.log(posts);
  
    dispatch({ type: FETCH_ALL, payload: posts });
  } catch (error) {
    console.log(error);
  }
};

export const createPost = (post) => async (dispatch) => {
  try {
    const { data } = await api.createPost(post);

    dispatch({ type: CREATE, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = (id, post) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(id, post);

    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = (id) => async (dispatch) => {

  try {
    const { data } = await api.likePost(id);

    dispatch({ type: LIKE, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    await await api.deletePost(id);

    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.log(error);
  }
};