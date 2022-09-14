import React from "react";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useParams } from "react-router-dom";
import axios from "../axios";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments } from "../redux/slices/comments";

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const { id } = useParams();
  const allComments = useSelector((state) => state.posts.comments.items);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchComments());
  }, []);

  React.useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => alert("Ошибка при получении статьи!"));
  }, []);

  if (isLoading) {
    return <Post isLoading={isLoading} />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ""}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={
          allComments
            ? allComments.filter((item) => item.postId === id).length
            : 0
        }
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
        items={
          allComments
            ? allComments
                .filter((item) => item.postId === id)
                .map((item) => {
                  return {
                    user: {
                      userId: item.user,
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
        isEditble={true}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
