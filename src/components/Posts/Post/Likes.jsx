import React, { useState } from 'react';

import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import { Button } from '@material-ui/core';
import { likePost } from '../../../actions/posts';

const Likes = ({ post }) => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const [likes, setLikes] = useState(post.likes);
    
    let buttonText;
    
    const handleLike = async () => {
      const newLikes = await likePost(post.id);
      setLikes(newLikes);
    }

    if (likes?.length > 0) {
      buttonText = likes.find((like) => like === user?.result?.uid)
        ? (
          <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 1 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}` }</>
        ) : (
          <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
        );
    } else {
        buttonText = <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
    }

    return (
      <Button size="small" color="primary" disabled={!user?.result} onClick={async () => await handleLike()}>
        {buttonText}
      </Button>
    );
  };

  export default Likes;
  