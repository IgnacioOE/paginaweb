const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, 'users.json');

function getUsers() {
    if (!fs.existsSync(USERS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    try {
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

function saveUser(userData) {
    const users = getUsers();
    
    if (users.find(u => u.email === userData.email)) {
        throw new Error('El usuario ya existe');
    }

    const newUser = {
        id: Date.now(),
        ...userData
    };

    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return newUser;
}

module.exports = { saveUser, getUsers };