const express = require("express"); // Імпортуємо Express, щоб створити сервер
const methodOverride = require("method-override"); // Імпортуємо бібліотеку для підтримки методів PUT і DELETE
const path = require("path"); // Імпортуємо модуль path для роботи з файловими шляхами

const app = express(); // Створюємо додаток Express
const PORT = process.env.PORT || 3000; // Встановлюємо порт сервера (3000 за замовчуванням або з змінної середовища)

// Масив для зберігання постів
let posts = []; // Масив об'єктів, що представляють пости

// Middleware
app.use(express.urlencoded({ extended: true })); // Додаємо middleware для обробки URL-encoded форм
app.use(methodOverride("_method")); // Додаємо middleware для обробки методів PUT та DELETE
app.set("view engine", "ejs"); // Встановлюємо EJS як шаблонізатор
app.set("views", path.join(__dirname, "views")); // Вказуємо директорію для шаблонів

// Головна сторінка
app.get("/", (req, res) => {
  res.render("index", { title: "Home" }); // Рендеримо головну сторінку з передачею заголовка
});

// Список постів
app.get("/posts", (req, res) => {
  res.render("posts", { posts, title: "Posts List" }); // Рендеримо сторінку зі списком постів
});

// Форма для створення поста
app.get("/add-post", (req, res) => {
  res.render("add-post", { title: "Add Post" }); // Рендеримо форму для створення нового поста
});

// Створення нового поста
app.post('/add-post', (req, res) => {
  const { title, author, description } = req.body; // Отримуємо дані з форми
  const id = posts.length + 1; // Генеруємо унікальний ID для нового поста
  const newPost = { id, title, author, description }; // Створюємо об'єкт нового поста
  console.log("Новий пост:", newPost); // Логування нового поста
  posts.push(newPost); // Додаємо новий пост до масиву
  res.redirect('/posts'); // Перенаправляємо користувача до списку постів
});

// Форма для редагування поста
app.get('/posts/:id/edit', (req, res) => {
  console.log("ID з URL:", req.params.id); // Логування ID, отриманого з URL
  const post = posts.find((p) => p.id == req.params.id); // Знаходимо пост у масиві за ID
  console.log("Знайдений пост:", post); // Логування знайденого поста

  if (!post) { // Якщо пост не знайдено
    return res.status(404).render('error', { 
      title: 'Error', 
      message: 'Post not found' // Повертаємо 404 сторінку з повідомленням про помилку
    });
  }
  res.render('edit-post', { post, title: 'Edit Post' }); // Рендеримо форму редагування поста
});

// Оновлення поста
app.put('/posts/:id/edit', (req, res) => {
  const { title, author, description } = req.body; // Отримуємо нові дані з форми
  const post = posts.find((p) => p.id == req.params.id); // Знаходимо пост у масиві за ID

  if (post) { // Якщо пост знайдено
    post.title = title; // Оновлюємо заголовок поста
    post.author = author; // Оновлюємо автора поста
    post.description = description; // Оновлюємо опис поста
    console.log("Оновлений пост:", post); // Логування оновленого поста
  } else { // Якщо пост не знайдено
    return res.status(404).render('error', { 
      title: 'Error', 
      message: 'Post not found' // Повертаємо 404 сторінку з повідомленням про помилку
    });
  }

  res.redirect('/posts'); // Перенаправляємо користувача до списку постів
});

// Видалення поста
app.delete("/posts/:id/delete", (req, res) => {
  posts = posts.filter((p) => p.id != req.params.id); // Видаляємо пост з масиву за ID
  res.redirect("/posts"); // Перенаправляємо до списку постів
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // Логування успішного запуску сервера
});
