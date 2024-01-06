import { FETCH_ALL, CREATE, UPDATE, DELETE, COMMENT, FETCH_POST } from '../constants/actionTypes';

export default (posts = [], action) => {
  switch (action.type) {
    case FETCH_ALL:
      return action.payload;
    case FETCH_POST:
      return {...posts, post: action.payload};
    case CREATE:
      return [...posts, action.payload];
    case UPDATE:
      return posts.map((post) => (post._id === action.payload._id ? action.payload : post));
    case DELETE:
      return posts.filter(post => post.id !== action.payload.id);
    default:
      return posts;
  }
};