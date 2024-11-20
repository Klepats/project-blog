const express = require("express");
const methodOverride = require("method-override");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Масив для зберігання постів
let posts = [];

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Головна сторінка
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// Список постів
app.get("/posts", (req, res) => {
  res.render("posts", { posts, title: "Posts List" });
});

// Форма для створення поста
app.get("/add-post", (req, res) => {
  res.render("add-post", { title: "Add Post" });
});

// Створення нового поста
app.post('/add-post', (req, res) => {
  const { title, author, description } = req.body;
  const id = posts.length + 1; // Генерація ID
  const newPost = { id, title, author, description };
  console.log("Новий пост:", newPost); // Логування нового поста
  posts.push(newPost);
  res.redirect('/posts');
});



// Форма для редагування поста
app.get('/posts/:id/edit', (req, res) => {
  console.log("ID з URL:", req.params.id); // Додай логування, щоб перевірити ID
  const post = posts.find((p) => p.id == req.params.id); // Знайти пост у масиві
  console.log("Знайдений пост:", post); // Перевірка, чи пост знайдено

  if (!post) {
    return res.status(404).render('error', { 
      title: 'Error', 
      message: 'Post not found' 
    });
  }
  res.render('edit-post', { post, title: 'Edit Post' });
});

// Оновлення поста
app.put('/posts/:id/edit', (req, res) => {
  const { title, author, description } = req.body; // Отримуємо дані з форми
  const post = posts.find((p) => p.id == req.params.id); // Знаходимо пост у масиві

  if (post) {
    // Оновлюємо дані поста
    post.title = title;
    post.author = author;
    post.description = description;

    console.log("Оновлений пост:", post); // Логування оновленого поста
  } else {
    return res.status(404).render('error', { 
      title: 'Error', 
      message: 'Post not found' 
    });
  }

  res.redirect('/posts'); // Повертаємося до списку постів
});


// Видалення поста
app.delete("/posts/:id/delete", (req, res) => {
  posts = posts.filter((p) => p.id != req.params.id); // Видаляємо пост за ID
  res.redirect("/posts");
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
