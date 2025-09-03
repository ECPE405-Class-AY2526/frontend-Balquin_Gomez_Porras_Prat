const sqlite3 = require('sqlite3').verbose();

// Create (or open) a database file
const db = new sqlite3.Database('./mask.db', (err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create users table if it doesn’t exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Mask Detection Server is running!');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
  db.get(query, [email, password], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }
    if (row) {
      res.json({ success: true, message: "Login successful!", user: row });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });
});


app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;  
  db.run(query, [name, email, password], function(err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed: users.email")) {
        return res.status(400).json({ success: false, message: "This email is already registered. Try logging in instead." });
      }
      return res.status(400).json({ success: false, message: "Database error: " + err.message });
    }

    res.json({ success: true, message: "User registered successfully!", userId: this.lastID });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
