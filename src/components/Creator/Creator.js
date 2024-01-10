import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress, Grid, Divider } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Posts from '../Posts/Posts';
import { getPostsByCreator, queryPosts } from '../../actions/posts';
import { where } from 'firebase/firestore';

const Creator = () => {
  const { name } = useParams();
  const { posts, isLoading } = useSelector((state) => state.posts);
  // if (!posts.length && !isLoading) return 'No posts';

  console.log('CREATOR');

  return (
    <div>
      <Typography variant="h2">{name}</Typography>
      <Divider style={{ margin: '20px 0 50px 0' }} />
      <Posts fetchPosts={() => queryPosts(() => where("name", "==", name))} />
    </div>
  );
};

export default Creator;