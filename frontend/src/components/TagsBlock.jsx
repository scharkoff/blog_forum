import React from "react";

// -- Material UI imports
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";

// -- Libs
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

// -- Компоненты
import { SideBlock } from "./SideBlock";
import { fetchActiveTag, fetchPostsLikeTag } from "../redux/slices/posts";

export const TagsBlock = ({ items, isLoading = true }) => {
  const dispatch = useDispatch();
  const { activeTag } = useSelector((state) => state.posts.tags);
  const [activeTagName, setActiveTagName] = React.useState(activeTag);
  const { name } = useParams();

  React.useEffect(() => {
    setActiveTagName(name);
  }, []);

  const onGetPosts = (name) => {
    dispatch(fetchActiveTag(name));
    dispatch(fetchPostsLikeTag(name));
    setActiveTagName(name);
  };

  return (
    <SideBlock title="Тэги">
      <List>
        {(isLoading ? [...Array(5)] : items).map((name, i) => (
          <Link
            key={i}
            style={{
              textDecoration: "none",
              color: activeTagName === name ? "blue" : "black",
            }}
            to={`/tags/${name}`}
          >
            <ListItem key={i} onClick={() => onGetPosts(name)} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                {isLoading ? (
                  <Skeleton width={100} />
                ) : (
                  <ListItemText primary={name} />
                )}
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </SideBlock>
  );
};
