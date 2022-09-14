import React from "react";

// -- Material UI imports
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

// -- Компоненты
import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { useDispatch, useSelector } from "react-redux";

// -- Slices
import {
  fetchPosts,
  fetchTags,
  fetchSortedPosts,
  fetchSortedPostsLikeTag,
} from "../redux/slices/posts";

import { fetchComments } from "../redux/slices/comments";

// -- Libs
import { useParams } from "react-router-dom";
import store from "../redux/store";

export const Home = () => {
  // -- redux
  const dispatch = useDispatch();
  const state = store.getState();

  const { comments, posts } = state.posts;
  const sortedComments = [].concat(comments.items);
  let postsArray = [].concat(posts.items);

  let { tags } = useSelector((state) => state.posts);
  const userData = useSelector((state) => state.auth.data);
  const isHomePage = useSelector((state) => state.posts.posts.home);

  const { name } = useParams();
  const [activeTab, setActiveTab] = React.useState(0);

  const isPostsLoading = posts.status === "loading";

  React.useEffect(() => {
    name
      ? dispatch(fetchSortedPostsLikeTag({ activeTab, name }))
      : dispatch(fetchPosts());
    dispatch(fetchTags());
    dispatch(fetchComments());
  }, []);

  const onSortPosts = (value) => {
    value === 1 ? setActiveTab(1) : setActiveTab(0);
    if (name) {
      dispatch(fetchSortedPostsLikeTag({ value, name }));
    } else dispatch(fetchSortedPosts(value));
  };

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={activeTab}
        aria-label="basic tabs example"
      >
        <Tab onClick={() => onSortPosts(0)} label="Новые" />
        <Tab onClick={() => onSortPosts(1)} label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : postsArray).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={index}
                id={obj._id}
                title={obj.title}
                imageUrl={
                  obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ""
                }
                user={obj.user}
                createdAt={obj.createdAt.slice(0, 10)}
                viewsCount={obj.viewsCount}
                commentsCount={obj.commentsCount}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock
            isHomePage={isHomePage}
            items={tags.items ? tags.items : []}
            isLoading={false}
          />
          <CommentsBlock
            items={
              comments.items
                ? sortedComments
                    .slice(0, 5)
                    .reverse()
                    .map((item) => {
                      return {
                        user: {
                          fullName: item.fullName,
                          avatarUrl: item.avatarUrl,
                        },
                        text: item.text,
                        commentId: item._id,
                      };
                    })
                : []
            }
            isLoading={false}
            isEditable={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
