const bcrypt = require('bcrypt');

const password = 'yourPlainTextPassword'; // Replace this with your plain text password

// Hash the password
bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error('Error hashing the password:', err);
        return;
    }
    console.log('Hashed Password:', hash);
});
