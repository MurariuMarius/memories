const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const { getStorage, getDownloadURL } = require("firebase-admin/storage");
const { logger } = require("firebase-functions/v2");
const { log } = require("firebase-functions/logger");

const app = initializeApp();

const firestoreService = getFirestore();

exports.createPost = onCall(async (request) => {

  const post = { ...request.data, creator:request.auth.uid, likes: [], createdAt: Timestamp.now() };

  try {
    await firestoreService.collection('posts').add(post);
  } catch (err) {
    logger.log(err);
    throw new HttpsError('internal', 'Could not create post');
  }
  return post;
});

exports.likePost = onCall(async (request) => {

    const postID = request.data.postID;

    try{
      const post = await firestoreService.collection('posts').doc(postID).get();

      const likes = post.data().likes;

      const index = likes.indexOf(request.auth.uid);
      if (index == -1) {
        likes.push(request.auth.uid);
      } else {
        likes.splice(index, 1);
        logger.log('HERE');
        logger
      }

      await firestoreService.collection('posts').doc(postID).update({ likes });
      
      const updatedPost = await firestoreService.collection('posts').doc(postID).get();
      return { id: postID, ...updatedPost.data() };

    }catch(err){
      throw new HttpsError('internal', 'Could not add likes');
    }
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
    email: request.data.email,
  };

  await firestoreService.collection('users').doc(request.auth.uid).create(user);

  return { ...user, name: user.firstName + " " + user.lastName };
})

exports.createComment = onCall(async request => {
  const postID = request.data.postID;
  let comment = {
    text: request.data.text,
    userID: request.auth.uid,
    createdAt: Timestamp.now()
  }

  try {
    const userSnapshot = await firestoreService.collection('users').doc(comment.userID).get();
    const user =  { ...userSnapshot.data() };
    comment = { ...comment, firstName: user.firstName, lastName: user.lastName };
    await firestoreService.collection(`posts/${postID}/comments`).add(comment);
  } catch(err) {
    logger.log(err)
    logger.log(err.message)
    throw new HttpsError('internal', 'Could not create comment');
  }
});
