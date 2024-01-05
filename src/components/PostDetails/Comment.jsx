import React from "react";
import { Typography } from "@material-ui/core";
import getDate from "../../utils/getDate";

const Comment = ({ comment }) => {
  return (
    <div>
      <Typography>{comment.firstName} {comment.lastName} - {getDate(comment.createdAt)}</Typography>
      <Typography>{comment.text}</Typography>
    </div>
  );
};

export default Comment;