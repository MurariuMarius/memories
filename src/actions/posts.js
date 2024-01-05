import {  START_LOADING, END_LOADING, FETCH_ALL, FETCH_POST, FETCH_BY_SEARCH, CREATE, UPDATE, DELETE, LIKE, COMMENT } from '../constants/actionTypes';
import * as api from '../api/index.js';
import { firestoreService } from '../firebase/config.js';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';

const getComments = async (postId) => {
  const comments = [];
  const snapshot = await getDocs(collection(firestoreService, `posts/${postId}/comments`));
  snapshot.forEach(c => comments.push({id: c.id, ...c.data()}));
  return comments;
}

export const getPost = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });

    const snapshot = await getDoc(doc(firestoreService, "posts", id));
    const post = { id, ...snapshot.data() };

    post.comments = await getComments(post.id);

    dispatch({ type: FETCH_POST, payload: post });
  } catch (error) {
    console.log(error);
  }
};

// export const getPostsBySearch = (searchQuery) => async (dispatch) => {
//   try {
//     dispatch({ type: START_LOADING });
//     const { data: { data } } = await api.fetchPostsBySearch(searchQuery);

//     dispatch({ type: FETCH_BY_SEARCH, payload: { data } });
//     dispatch({ type: END_LOADING });
//   } catch (error) {
//     console.log(error);
//   }
// };

export const getPosts = () => async (dispatch) => {
  try {
    const posts = [];
    const data = await getDocs(collection(firestoreService, "posts"));

    data.forEach(doc => 
      posts.push({ id: doc.id, ...doc.data()})
    );

    for await (const post of posts) {
      post.comments = await getComments(post.id);  
    }

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

    data.comments = await getComments(id);

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

export const commentPost = (value, id) => async (dispatch) => {
  try {
    const { data } = await api.comment(value, id);

    dispatch({ type: COMMENT, payload: data });

  } catch (error) {
    console.log(error);
  }
};
