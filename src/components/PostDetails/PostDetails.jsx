import React, { useEffect, useState } from 'react';
import { Paper, Typography, CircularProgress, Divider, Button } from '@material-ui/core/';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

import { getPost, getPostsByTag } from '../../actions/posts';
import useStyles from './styles';
import getDate from '../../utils/getDate';
import CommentSection from './CommentSection';
import Posts from '../Posts/Posts';
import Likes from '../Posts/Post/Likes';

const PostDetails = () => {

  const [post, setPost] = useState();
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedPost = await getPost(id);
      setPost(fetchedPost);
    }
    fetchData();
  }, [id]);

  const goToProfilePage = (e) => {
    e.stopPropagation();
    history.push(`creators/${post?.creator}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
      {post ? (   
        <div className={classes.card}>
          <div className={classes.section}>
            <Typography variant="h3" component="h2">{post.title}</Typography>
            <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
            <div className={classes.imageSection}>
              <img className={classes.media} src={post.image || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title} />
            </div>
            <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
            <div className={classes.profile}>

            </div>
             <Typography variant="h6">Created by:
              <Button onClick={goToProfilePage}>
            <Typography variant="h6" className={classes.profileLink}>{post.name} </Typography>
          </Button></Typography>
            <Typography variant="body1">{getDate(post.createdAt)}</Typography>
            <Likes post={post} />
            <Divider style={{ margin: '20px 0' }} />
            <CommentSection post={post} />
            <Divider style={{ margin: '20px 0' }} />
          </div>
          <div className={classes.recommendedPosts}>
            <Posts fetchPosts={() => getPostsByTag(post.tags, post.id)} />
          </div>
        </div>
      ) : (
        <CircularProgress />
      )}
    </Paper>
  );
};

export default PostDetails;