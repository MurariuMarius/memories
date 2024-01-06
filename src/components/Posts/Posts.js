import React, { useEffect, useState } from 'react';
import { Grid, CircularProgress } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Post from './Post/Post';
import useStyles from './styles';

const Posts = ({ fetchPosts }) => {
  const posts = useSelector((state) => state.posts);
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch, fetchPosts]);
  
  console.log(posts);
  return (
    !posts.length ? null : (
      <Grid className={classes.container} container alignItems="stretch" spacing={3}>
        {posts.map((post) => (
          <Grid key={post.id} item xs={12} sm={6} md={6}>
            <Post post={post} />
          </Grid>
        ))}
      </Grid>
    )
  );
};

export default Posts;