// app.js — The main Express application

const express = require('express');
const Database = require('better-sqlite3');

const app = express();
app.use(express.json());

const db = new Database('employees.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS employees (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
`);

app.get('/employees', (req, res) => {
  const rows = db.prepare('SELECT * FROM employees').all();
  res.json(rows);
});

app.post('/employees', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const result = db.prepare('INSERT INTO employees (name) VALUES (?)').run(name);
  res.status(201).json({ id: result.lastInsertRowid, name });
});

if (require.main === module) {
  app.listen(3000, () => console.log('Server running on port 3000'));
}

module.exports = app;