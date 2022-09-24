import React from "react";

// -- Material UI
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

// -- Components
import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";

// -- React-redux
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

// -- Redux state
import store from "../redux/store";
import {
  fetchPosts,
  fetchTags,
  fetchSortedPosts,
  fetchSortedPostsLikeTag,
} from "../redux/slices/posts";
import { fetchComments } from "../redux/slices/comments";
import { fetchAuthMe } from "../redux/slices/auth";

export const Home = () => {
  // -- Redux dispatch
  const dispatch = useDispatch();

  // -- Redux state
  const state = store.getState();

  // -- Комментарии и посты в стейте
  const { comments, posts } = state.posts;

  // -- Отсорированные комментарии
  const sortedComments = [].concat(comments.items);

  // -- Посты
  let postsArray = [].concat(posts.items);

  // -- Теги
  let { tags } = useSelector((state) => state.posts);

  // -- User data
  const userData = useSelector((state) => state.auth.data);

  // -- На главной ли странице
  const isHomePage = useSelector((state) => state.posts.posts.home);

  // -- Актуальный тег
  const { name } = useParams();

  // -- useState
  const [activeTab, setActiveTab] = React.useState(0);

  // -- Загружаются ли посты
  const isPostsLoading = posts.status === "loading";

  // -- useEffect
  React.useEffect(() => {
    name
      ? dispatch(fetchSortedPostsLikeTag({ activeTab, name }))
      : dispatch(fetchPosts());
    dispatch(fetchTags());
    dispatch(fetchComments());
    dispatch(fetchAuthMe());
  }, []);

  // -- Functions
  // -- Обработка клика по выбранному тегу
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
                isEditable={userData?._id === obj?.user?._id}
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
                          fullName: item.user?.fullName,
                          avatarUrl: item.user?.avatarUrl,
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
