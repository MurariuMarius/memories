import { FETCH_ALL, CREATE, UPDATE, DELETE, FETCH_POST, UPDATE_POST_FORM } from '../constants/actionTypes';

const postsReducer = (posts = [], action) => {
  switch (action.type) {
    case FETCH_ALL:
      return action.payload;
    case FETCH_BY_CREATOR:
      return {...state,posts:action.payload.data};
    case FETCH_POST:
      return {...posts, post: action.payload};
    case CREATE:
      return [...posts, action.payload];
    case UPDATE:
      return posts.map((post) => (post.id === action.payload.id ? action.payload : post));
    case DELETE:
      return posts.filter(post => post.id !== action.payload.id);
    default:
      return posts;
  }
};

const postToUpdate = (postToUpdate = null, action) => {
  switch (action.type) {
    case UPDATE_POST_FORM:
      return action.payload;
    default:
      return postToUpdate;
  }
}

export { postsReducer, postToUpdate };
