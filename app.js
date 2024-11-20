const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Post = require("./models/postModel");

const app = express();
const PORT = process.env.PORT || 3000;

// Налаштування підключення до MongoDB
const db = process.env.MONGODB_URI;

// Налаштування Express
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Підключення до бази даних
async function start() {
  try {
    await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the app:", error);
    process.exit(1); // Завершити процес із кодом помилки
  }
}

// Головна сторінка
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// Список постів
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.render("posts", { posts, title: "Posts List" });
  } catch (error) {
    console.error(error);
    res.render("error", { message: "Failed to load posts" });
  }
});

// Форма для створення поста
app.get("/add-post", (req, res) => {
  res.render("add-post", { title: "Add Post" });
});

// Створення нового поста
app.post("/add-post", async (req, res) => {
  try {
    const { title, author, description } = req.body;
    const newPost = new Post({ title, author, description });
    await newPost.save();
    res.redirect("/posts");
  } catch (error) {
    console.error(error);
    res.render("error", { message: "Failed to create post" });
  }
});

// Форма редагування поста
app.get("/posts/:id/edit", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render("edit-post", { post, title: "Edit Post" });
  } catch (error) {
    console.error(error);
    res.render("error", { message: "Failed to load post for editing" });
  }
});

// Оновлення поста
app.post("/posts/:id/edit", async (req, res) => {
  try {
    const { title, author, description } = req.body;
    await Post.findByIdAndUpdate(req.params.id, { title, author, description });
    res.redirect("/posts");
  } catch (error) {
    console.error(error);
    res.render("error", { message: "Failed to update post" });
  }
});

// Видалення поста
app.post("/posts/:id/delete", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/posts");
  } catch (error) {
    console.error(error);
    res.render("error", { message: "Failed to delete post" });
  }
});

// Запуск програми
start();
