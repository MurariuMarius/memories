import React from 'react';

import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import { useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import { likePost } from '../../../actions/posts';

const Likes = ({ post }) => {
    const user = JSON.parse(localStorage.getItem('profile'));
    
    const dispatch = useDispatch();

    console.log(post);

    let buttonText;

    if (post?.likes?.length > 0) {
      buttonText = post.likes.find((like) => like === user?.result?.uid)
        ? (
          <><ThumbUpAltIcon fontSize="small" />&nbsp;{post.likes.length > 1 ? `You and ${post.likes.length - 1} others` : `${post.likes.length} like${post.likes.length > 1 ? 's' : ''}` }</>
        ) : (
          <><ThumbUpAltOutlined fontSize="small" />&nbsp;{post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}</>
        );
    } else {
        buttonText = <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
    }

    return (
      <Button size="small" color="primary" disabled={!user?.result} onClick={() => dispatch(likePost(post.id))}>
        {buttonText}
      </Button>
    );
  };

  export default Likes;
  