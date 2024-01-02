import React from "react";
import { Typography } from "@material-ui/core";
import moment from "moment";

const Comment = ({ comment }) => {
  return (
    <div>
      <Typography>{comment.firstName} {comment.lastName} - { moment(new Date(comment.createdAt.seconds * 1000)).fromNow() } </Typography>
      <Typography>{comment.text}</Typography>
    </div>
  );
};

export default Comment;