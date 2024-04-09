// auth.js controller
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.register = async (req, res) => {
    const { userType, email, username, password } = req.body;
    console.log(userType, email, username, password);
    db.query('SELECT UserName FROM users WHERE UserName = ?', [username], async (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('loginRegister', {
                message: 'That username is already in use'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', { Type: userType, Email: email, Username: username, Password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('loginRegister', {
                    message: 'User registered'
                });
            }
        });
    });

};


exports.login = async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE UserName = ?', [username], async (error, results) => {
        if (error) {
            console.log(error);
            return res.render('loginRegister', {
                message: 'Error during login'
            });
        }

        // Check if results is defined and not an empty array
        if (results && results.length > 0) {
            const isPasswordValid = await bcrypt.compare(password, results[0].Password);

            if (isPasswordValid) {
                // set cookie to userid
                console.log(results[0].userID);
                console.log(results[0].Type);

                const token = jwt.sign({ userID: results[0].userID, Username: results[0].Username, Type: results[0].Type }, process.env.JWT_SECRET, {
                    expiresIn: '1h' // You can adjust the expiration time as needed
                });
        
                // Set the JWT token as a cookie
                res.cookie('jwt', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Set to true in production if using HTTPS
                    maxAge: 3600000, // 1 hour in milliseconds
                    sameSite: 'strict' // Adjust based on your requirements
                });
                // Password is correct, handle login success
                res.redirect('/dashboard');
            } else {
                // Password is incorrect, handle login failure
                return res.render('loginRegister', {
                    message: 'Invalid email or password'
                });
            }
        } else {
            // Handle the case where no user with the given username was found
            return res.render('loginRegister', {
                message: 'Invalid email or password'
            });
        }
    });
};


exports.logout = (req, res) => {
    // Clear the cookie containing the JWT
    // redirect to home page
    const token = req.cookies.jwt;
    res.cookie('jwt', token, {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict' 
    });
    res.redirect('/');
}



