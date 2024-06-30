const router = require('express').Router();
const db = require('../config/dbConfig');
const { createUser } = require('../models/usersModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
require('dotenv').config();

// register new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const checkUserExistsQuery = 'SELECT * FROM users WHERE email = $1';
        const userExists = await db.query(checkUserExistsQuery, [email]);
        console.log(userExists.rows.length)
        if (userExists.rows.length > 0) { 
            return res.send({
                message: 'User already exists',
                success: false,
                data: null,
            });
        }
        // No user exists, proceed with creating a new user
        const newUser = await createUser(name, email, password);
        
        res.send({
            message: 'User created successfully',
            success: true,
            data: newUser,
        });

    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});
//login user
router.post('/login', async (req, res) =>{
    try{
        const userExistsQuery = 'SELECT * FROM users WHERE email = $1';
        const userExists = await db.query(userExistsQuery, [req.body.email]);
        if(userExists.rows.length === 0){
            return res.send({
                message: 'User does not exist',
                success: false,
                data: null,
            });
        }
        const user = userExists.rows[0];
        const passwordMatch = await bcrypt.compare(req.body.password, user.password_hash);
        if(!passwordMatch){
            return res.send({
                message: 'Incorrect password',
                success: false,
                data: null,
            });
        }

        const token = jwt.sign({userId: user.userid}, process.env.jwt_secret, {expiresIn: '1d'});
        res.send({
            message: 'Login successful',
            success: true,
            data: token,
        });
    } catch(error){
        res.status(500).send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

//get user by id
router.post('/get-user-by-id',authMiddleware, async (req, res) =>{
    try{
        const userQuery = 'SELECT * FROM users WHERE userid = $1';
        const user = await db.query(userQuery, [req.body.userId]);
        res.send({
            message: 'User retrieved successfully',
            success: true,
            data: user.rows[0],
        });
    } catch(error){
        res.status(500).send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

//get all users
router.post('/get-all-users',authMiddleware, async (req, res) =>{
    try{
        const usersQuery = 'SELECT * FROM users';
        const users = await db.query(usersQuery);
        res.send({
            message: 'Users retrieved successfully',
            success: true,
            data: users.rows,
        });
    } catch(error){
        res.status(500).send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

//update user permission
router.post('/update-user-permission',authMiddleware, async (req, res) =>{
    try{
        // console.log(req.body);
        const userQuery = 'UPDATE users SET isadmin = $1 WHERE userid = $2';
        await db.query(userQuery, [req.body.isadmin, req.body.userid]);
        res.send({
            message: 'User permission updated successfully',
            success: true,
            data: null,
        });
    } catch(error){
        res.status(500).send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});
module.exports = router;
