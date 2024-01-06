const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const { getStorage, getDownloadURL } = require("firebase-admin/storage");
const { logger } = require("firebase-functions/v2");
const { log } = require("firebase-functions/logger");

const app = initializeApp();

const firestoreService = getFirestore();
const bucket = getStorage().bucket();

exports.createPost = onCall(async (request) => {

  const post = { ...request.data, creator:request.auth.uid, likes: [], createdAt: Timestamp.now() };

  const tags = []
  post.tags.map(tag => tags.push(tag.toLowerCase()));
  post.tags = tags;

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

async function deleteCollection(db, collectionPath, batchSize) {
  async function deleteQueryBatch(db, query, resolve) {
    const snapshot = await query.get();
  
    const batchSize = snapshot.size;
    if (batchSize === 0) {
      // When there are no documents left, we are done
      resolve();
      return;
    }
  
    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  
    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
      deleteQueryBatch(db, query, resolve);
    });
  }

  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

const deleteStoredFile = async (url, userID) => {
  const imageID = url.split('%2F')[2].split('?alt')[0];
  logger.log(`posts/${userID}/${imageID}`);
  const fileRef = bucket.file(`posts/${userID}/${imageID}`);
  await fileRef.delete();
}

exports.deletePost = onCall(async (request) => {

  const postID = request.data.postID;
  const imageURL = request.data.imageURL;

  try {
    await deleteCollection(firestoreService, `posts/${postID}/comments`, 100);
    logger.log(postID);
    await firestoreService.collection('posts').doc(postID).delete();
    await deleteStoredFile(imageURL, request.auth.uid);
  } catch(err) {
    logger.log(err);
    throw new HttpsError('internal', 'Could not delete post');
  }
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

  const getComments = async (postId) => {
    const comments = [];
    const snapshot = await firestoreService.collection(`posts/${postId}/comments`).get();
    snapshot.forEach(c => comments.push({id: c.id, ...c.data()}));
    return comments;
  }

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
    const snapshot = await firestoreService.collection(`posts/${postID}/comments`).add(comment);

    const post = await snapshot.get();

    const comments = await getComments(postID);
    return { id: post.id, ...post.data(), comments };
  } catch(err) {
    logger.log(err)
    logger.log(err.message)
    throw new HttpsError('internal', 'Could not create comment');
  }
});
