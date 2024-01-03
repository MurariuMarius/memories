import {  START_LOADING, END_LOADING, FETCH_ALL, FETCH_POST, FETCH_BY_SEARCH, CREATE, UPDATE, DELETE, LIKE, COMMENT ,FETCH_BY_CREATOR} from '../constants/actionTypes';
import * as api from '../api/index.js';
import { firestoreService } from '../firebase/config.js';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';

const getComments = async (postId) => {
  const comments = [];
  const snapshot = await getDocs(collection(firestoreService, `posts/${postId}/comments`));
  snapshot.forEach(c => comments.push({id: c.id, ...c.data()}));
  return comments;
}

export const getPost = async (id) => {
  try {
    const snapshot = await getDoc(doc(firestoreService, "posts", id));
    const post = { id, ...snapshot.data() };

    post.comments = await getComments(post.id);

    return post;
  } catch (error) {
    console.log(error);
  }
};

export const getPostsByTag = (tags, originalID) => async (dispatch) => {
  try {
    // dispatch({ type: START_LOADING });
    
    console.log(tags);

    const posts = [];

    const postsRef = collection(firestoreService, "posts");
    const filteredPosts = query(postsRef,
      where("tags", "array-contains-any", tags));
      
    const snapshot = await getDocs(filteredPosts);
    snapshot.forEach(doc => {
      if (doc.id !== originalID) {
        posts.push({ id: doc.id, ...doc.data() });
      }
    })

    console.log(posts);


    dispatch({ type: 'FETCH_ALL', payload: posts });
    // dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

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

export const updatePost = (post) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(post);

    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (id) => {

  try {
    const { data } = await api.likePost(id);

    return data.likes;
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = (post) => async (dispatch) => {
  try {
    await api.deletePost(post);

    dispatch({ type: DELETE, payload: post });
  } catch (error) {
    console.log(error);
  }
};

export const commentPost = async (value, id) => {
  try {
    const { data } = await api.comment(value, id);
    return data.comments;
  } catch (error) {
    console.log(error);
  }
};

export const getPostsByCreator = (name) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data: { data } } = await api.fetchPostsByCreator(name);

    dispatch({ type: FETCH_BY_CREATOR, payload: { data } });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};
