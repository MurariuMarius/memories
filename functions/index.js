const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const { getStorage, getDownloadURL } = require("firebase-admin/storage");
const { logger } = require("firebase-functions/v2");

const app = initializeApp();

const firestoreService = getFirestore();
const storageBucket = getStorage().bucket();

exports.createPost = onCall(async (request) => {

  const getFileFromBase64 = (base64) => {
    return Uint8Array.from(Buffer.from(base64, 'base64'));
  }

  const addImageURL = async (post) => {
    if (!post.selectedFile) {
      throw new HttpsError('invalid-argument', "No image added");
    }
    const file = getFileFromBase64(post.selectedFile);
    const fileRef = storageBucket.file(`posts/${request.auth.uid}/${Math.random()}`);
    await fileRef.save(file);

    post.selectedFile = await getDownloadURL(fileRef);
  }

  const post = { ...request.data, creator:request.auth.uid, likes: 0, createdAt: Timestamp.now() };

  try {
    await addImageURL(post);
    await firestoreService.collection('posts').add(post);
  } catch (err) {
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

  await firestoreService.collection('users').add(user);

  return { ...user, name: user.firstName + " " + user.lastName };
})
