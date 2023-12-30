import React from "react";
import { Typography } from "@material-ui/core";

const Comment = ({ comment }) => {
    console.log(comment);
    return (
        <Typography>{ comment.text }</Typography>
    );
};

export default Comment;