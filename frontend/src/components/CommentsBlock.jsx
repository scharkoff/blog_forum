import React from "react";

import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";

import { useDispatch, useSelector } from "react-redux";
import { selectIsAuth } from "../redux/slices/auth.js";
import { useParams } from "react-router-dom";
import { fetchEditComment, fetchRemoveComment } from "../redux/slices/comments";

export const CommentsBlock = ({
  items,
  children,
  isLoading = true,
  isEditble,
}) => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const id = useParams();
  const userId = useSelector((state) =>
    state.auth.data ? state.auth.data._id : null
  );

  function onRemoveComment(commentId) {
    if (window.confirm("Вы действительно хотите удалить комментарий?")) {
      dispatch(fetchRemoveComment({ commentId, id }));
    }
  }

  function onEditComment(commentId, text) {
    dispatch(fetchEditComment({ id, commentId, text }));
  }

  return (
    <SideBlock title="Комментарии">
      <List>
        {(isLoading && items ? [...Array(5)] : items).map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar alt={obj.user.fullName} src={obj.user.avatarUrl} />
                )}
              </ListItemAvatar>
              {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>
              ) : (
                <>
                  <ListItemText
                    primary={obj.user.fullName}
                    secondary={obj.text}
                  />
                  {isAuth && isEditble && userId === obj.user.userId ? (
                    <>
                      <IconButton
                        onClick={() => onRemoveComment(obj.commentId)}
                        color="secondary"
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => onEditComment(obj.commentId, obj.text)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </>
                  ) : null}
                </>
              )}
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};
