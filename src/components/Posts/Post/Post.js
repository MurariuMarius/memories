import React from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@material-ui/core/';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { deletePost } from '../../../actions/posts';
import getDate from '../../../utils/getDate'
import useStyles from './styles';
import Likes from './Likes';
import { UPDATE_POST_FORM } from '../../../constants/actionTypes';
import { Link } from '@material-ui/icons';

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));
  const history = useHistory();

  const openPost = (e) => {
    history.push(`/posts/${post.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const goToProfilePage = (e) => {
    e.stopPropagation();
    history.push(`creators/${post?.creator}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <Card className={classes.card} raised elevation={6}>
      <ButtonBase
        component="span"
        name="test"
        className={classes.buttonBase}
        onClick={openPost}
      >
        <CardMedia
          className={classes.media}
          image={post.image || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'}
          title={post.title}
        />
        <div className={classes.overlay}>
          <Button onClick={goToProfilePage}>
            <Typography variant="h6" className={classes.profileLink}>{post.name} </Typography>
          </Button>
          <Typography variant="body2">{getDate(post.createdAt)}</Typography>
        </div>
        {(user?.result?.googleId === post?.creator || user?.result?.uid === post?.creator) && (
        <div className={classes.overlay2} name="edit">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              dispatch((() => async (dispatch) => dispatch({type: UPDATE_POST_FORM, payload: post}))())
              history.push('/posts');
              console.log('clicked');
            }}
            style={{ color: 'white' }}
            size="small"
          >
            <MoreHorizIcon fontSize="default" />
          </Button>
        </div>
        )}
        <div className={classes.details}>
          <Typography variant="body2" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
        </div>
        <Typography className={classes.title} gutterBottom variant="h5" component="h2">{post.title}</Typography>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">{post.message.split(' ').splice(0, 20).join(' ')}...</Typography>
        </CardContent>
      </ButtonBase>
      <CardActions className={classes.cardActions}>
        <Likes post={post}/>
        {(user?.result?.uid === post?.creator) && (
          <Button size="small" color="secondary" onClick={() => dispatch(deletePost(post))}>
            <DeleteIcon fontSize="small" /> &nbsp; Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default Post;