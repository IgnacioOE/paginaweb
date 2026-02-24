// node server.js

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { saveUser, getUsers } = require('./userHandler'); 
const app = express();
const PORT = 3000;
const SECRET_KEY = 'token123';

app.use(cors()); 
app.use(express.json());

app.post('/api/signup', (req, res) => {
    const { email, password } = req.body; 
    if (!email || !password) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    try {
        const newUser = saveUser({ email, password });
        console.log("Se registró un nuevo usuario");
        res.status(201).json({ success: true, message: 'Usuario registrado', user: newUser });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Faltan datos' });
    }

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ success: true, message: 'Login exitoso', token: token });
    } else {
        res.status(401).json({ success: false, error: 'El correo y/o la contraseña son incorrectos' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});