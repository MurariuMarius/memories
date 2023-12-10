const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const logger = require("firebase-functions/logger");

const app = initializeApp();

const firestoreService = getFirestore();

exports.createPost = onCall(async (request) => {

  const post = { ...request.data, createdAt: Timestamp.now() };

  try {
    await firestoreService.collection('posts').add(post);
  } catch (err) {
    throw new HttpsError('internal', 'Could not create post');
  }
  return post;
});

exports.likePost = onCall(async (request) => {

    const like = {...request.data};

    try{
      await firestoreService.collection('likes').add(like);
    }catch(err){
      throw new HttpsError('internal', 'Could not add likes');
    }

    return like;
});

exports.updatePost = onCall(async (request) =>{

    const update = {...request.data};

    try{
      await firestoreService.collection('updates').add(update);
    }catch(err){
      throw new HttpsError('internal','Could not add updates');
    }

    return update;
});

exports.deletePost = onCall(async (request) => {

  const del = {...request.data};

  try{
    await firestoreService.collection('deletes').add(del);
  }catch(err){
    throw new HttpsError('internal', 'Could not add delete');
  }

  return del;
});

exports.createUser = onCall(async (request) => {
  const user = {
    firstName: request.data.firstName,
    lastName: request.data.lastName,
    email: request.data.email
  };

  await firestoreService.collection('users').add(user);

  return user;
})
