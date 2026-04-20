const express = require('express');
const app = express();
const PORT = 3000;

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to Homework API');
});

// Intro route
app.get('/intro', (req, res) => {
  res.send("Hi, I'm a Year 2 IT student learning how to build APIs!");
});

// Name route
app.get('/name', (req, res) => {
  res.send('Pat'); // change this to your real name
});

// Hobbies route (BONUS: JSON list)
app.get('/hobbies', (req, res) => {
  res.json(["coding", "reading", "cycling"]);
});

// Food route
app.get('/food', (req, res) => {
  res.send('I love chicken rice, sushi, and bubble tea!');
});

// BONUS: Student JSON object
app.get('/student', (req, res) => {
  res.json({
    name: "Pat",
    hobbies: ["coding", "reading", "cycling"],
    intro: "Hi, I'm Pat, a Year 2 student passionate about building APIs!"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});