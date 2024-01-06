import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@material-ui/core';
import { createPost, updatePost } from '../../actions/posts';
import useStyles from './styles';

import CloudUploadIcon from '@material-ui/icons/CloudUpload'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Form = () => {
  const [postData, setPostData] = useState({ title: '', message: '', tags: '', image: '' });
  const dispatch = useDispatch();
  const originalPost = useSelector(state => {
    console.log(state);
    return state.postToUpdate;
  });
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));

  useEffect(() => {
    console.log('useEffect');
    if (originalPost) {
      setPostData(originalPost);
    }
  }, [originalPost]);

  const clear = () => {
    setPostData({ title: '', message: '', tags: '', image: '' });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!originalPost) {
      dispatch(createPost({ ...postData, name: user?.result?.name }));
      clear();
    } else {
      dispatch(updatePost({ ...postData, name: user?.result?.name }));
      clear();
    }
  };

  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Please Sign In to share your own memories and like other memories.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper className={classes.paper}>
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6">{originalPost ? `Editing ${originalPost?.title}` : 'Share a memory'}</Typography>
        <TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} />
        <TextField name="message" variant="outlined" label="Message" fullWidth multiline rows={4} value={postData.message} onChange={(e) => setPostData({ ...postData, message: e.target.value })} />
        <TextField name="tags" variant="outlined" label="Tags (comma separated)" fullWidth value={postData.tags} onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })} />
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
          Upload file
          <VisuallyHiddenInput type="file" onChange={e => setPostData({ ...postData, image: e.target.files[0] })}/>
        </Button>      
        <TextField name="imageURL" variant="outlined" label="... or provide an URL" fullWidth value={postData.image} onChange={(e) => setPostData({ ...postData, image: e.target.value })} />
        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
        <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
      </form>
    </Paper>
  );
};

export default Form;