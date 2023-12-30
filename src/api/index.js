import axios from 'axios';
import { getFunctions, httpsCallable } from 'firebase/functions'
import { app, authService } from '../firebase/config'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

const API = axios.create({ baseURL: 'https://us-central1-memories-8f4d0.cloudfunctions.net' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }

  return req;
});

const functions = getFunctions()

// export const fetchPosts = () => API.get('/posts');

export const createPost = async (newPost) => {
  console.log(JSON.parse(JSON.stringify(newPost)));
  const createPost = httpsCallable(functions, 'createPost');
  await createPost(newPost);
};
export const likePost = async (postID) => {
  const likePost = httpsCallable(functions, 'likePost');
  const res = await likePost({ postID });
  return res;
}
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);

export const signIn = async (formData) => {
  console.log(formData.email, formData.password);
  const userCredentials = await signInWithEmailAndPassword(authService, formData.email, formData.password);
  const user = userCredentials.user;
  console.log({ ...user, name: user.displayName });
  return {data: { ...user, name: user.displayName }}
}

export const signUp = async (formData) => {
  const res = await createUserWithEmailAndPassword(authService, formData.email, formData.password);

  console.log(authService.currentUser);
  updateProfile(res.user, { displayName: formData.firstName });

  const createUser = httpsCallable(functions, 'createUser');
  const user = await createUser({ firstName: formData.firstName, lastName: formData.lastName, email: formData.email });


  return user;
}