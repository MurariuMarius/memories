import axios from 'axios';
import { getFunctions, httpsCallable } from 'firebase/functions'
import { app, authService, storageBucket } from '../firebase/config'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const functions = getFunctions()

// export const fetchPost = (id) => API.get(`/posts/${id}`);
// export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
// export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);
export const createPost = async (newPost) => {
  const createPost = httpsCallable(functions, 'createPost');

  const addImageURL = async (post) => {
    if (!post.image) {
      throw new Error('No file selected')
    }
    const storageRef = ref(storageBucket, `posts/${authService.currentUser.uid}/${Math.random()}`);
    await uploadBytes(storageRef, post.image);
    post.image = await getDownloadURL(storageRef);
    console.log(post.image);
  }

  await addImageURL(newPost);
  await createPost(newPost);
};
export const likePost = async (postID) => {
  const likePost = httpsCallable(functions, 'likePost');
  const res = await likePost({ postID });
  return res;
}
export const updatePost = (id, updatedPost) => undefined;
export const deletePost = (id) => undefined;

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

export const comment = async (text, postID) => {
  const createComment = httpsCallable(functions, 'createComment');
  const post = await createComment({ text, postID });
  return post;
}