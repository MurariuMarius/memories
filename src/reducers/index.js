import { combineReducers } from 'redux';

import { postsReducer as posts, postToUpdate } from './posts';
import auth from './auth';

export const reducers = combineReducers({ posts, auth, postToUpdate });
