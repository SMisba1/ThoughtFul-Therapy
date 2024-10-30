const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

// Set up database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'Misba',      // Replace with your MySQL username
  password: 'Misba@123',  // Replace with your MySQL password
  database: 'loginDB'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to database');
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
    if (err) throw err;

    if (result.length === 0) return res.status(401).json({ message: 'User not found' });

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Incorrect password' });
    }
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
