import PostModel from "../models/Post.js";

// -- Получить все статьи
export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    return res.json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Не удалось получить статьи!",
    });
  }
};

// -- Получить последние 5 тегов
export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    return res.json(tags);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Не удалось получить статьи!",
    });
  }
};

// -- Получить одну статью
export const getOne = (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          console.log(error);
          return res.status(500).json({
            message: "Не удалось получить статьи!",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Статья не найдена!",
          });
        }

        return res.json(doc);
      }
    ).populate("user");
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Не удалось получить статьи!",
    });
  }
};

// -- Удалить статью
export const remove = (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(error);
          return res.status(500).json({
            message: "Не удалось удалить статью!",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Статья не найдена!",
          });
        }

        return res.json({
          success: true,
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Не удалось получить статьи!",
    });
  }
};

// -- Создать статью
export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();
    return res.json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Не удалось создать статью!",
    });
  }
};

// -- Обновить статью
export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      }
    );

    return res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Не удалось обновить статью!",
    });
  }
};
