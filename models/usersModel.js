
const db = require('../config/dbConfig');
const bcrypt = require('bcrypt');

const createUser = async (name, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        // Use db client to insert a new user
        const insertUserText = 'INSERT INTO users(username, email, password_hash) VALUES($1, $2, $3) RETURNING *';
        const insertUserValues = [name, email, hashedPassword];
        const response = await db.query(insertUserText, insertUserValues);
        
        return response.rows[0];
    } catch (error) {
        console.error('Error creating new user:', error);
        throw error;
    }
};
module.exports = {
    createUser
};
