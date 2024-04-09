const express = require('express');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const mysql = require('mysql');
const bodyParser = require('body-parser'); // Import body-parser middleware
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './.env' });

const app = express();
app.set('view engine', 'hbs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('MySQL Connected...');
    }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); // Use body-parser middleware for parsing URL-encoded bodies
app.use(bodyParser.json()); // Use body-parser middleware for parsing JSON bodies
app.use(cookieParser());

// Routes
app.use('/auth', require('./routes/auth')); // Use '/auth' route for authentication-related routes
app.use('/profile', require('./routes/profile')); // Use '/profile' route for profile-related routes
app.use('/jobs', require('./routes/jobs')); // Use '/job' route for job-related routes
// Listen for requests on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// Function to log IP address, timestamp, and requested URL
function log(req, res) {
    console.log(req.ip + ' ' + new Date().toLocaleString() + ' ' + req.url);
}

app.get('/', (req, res) => {
    const token = req.cookies.jwt;
    var username;
    if (token != undefined) {
        loggedIn = true;
        jwt.verify(token,  process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                return res.redirect('/');
            } else {
                console.log("we are here")
                return username = decodedToken.Username;
                console.log(username);
            }
        }
        );
    } else {
        loggedIn = false;
        username = '';
    }
    console.log(username);
    // Render 'index.ejs' from the 'views' folder
    res.render('index', { loggedIn, username });
    // Log the request details
    log(req, res);
});

// Handle GET requests for the '/loginRegister' URL
app.get('/loginRegister', (req, res) => {
    // Send the 'loginRegister.html' file as the response
    res.render('loginRegister');
    // Log the request details
    log(req, res);
});


app.get('/dashboard', (req, res) => {
        // Retrieve the JWT token from the request cookies
        const token = req.cookies.jwt;
        console.log(token);
    
        // Verify the JWT token
        jwt.verify(token,  process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                // Token is invalid, handle accordingly (e.g., redirect to login)
                return res.redirect('/login-register');
            } else {
                // Token is valid, you can access user information in decodedToken
                console.log(decodedToken);
                const userId = decodedToken.userID;
                const username = decodedToken.Username;
                const userType = decodedToken.Type;
                
    
                // Render 'dashboard.ejs' and pass user information or perform actions
                res.render('dashboard', { userId, username, userType});
                console.log(userId);
                console.log(username);
            }
        });
    
        // Log the request details
        log(req, res);
});



app.get('/jobBoard', (req, res) => {
    const token = req.cookies.jwt;
    console.log(token);

    // Verify the JWT token
    jwt.verify(token,  process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            // Token is invalid, handle accordingly (e.g., redirect to login)
            return res.redirect('/loginRegister');
        } else {
            // Token is valid, you can access user information in decodedToken
            console.log(decodedToken);
            const userId = decodedToken.userID;
            const username = decodedToken.Username;
            const userType = decodedToken.Type;
            console.log(userType);
            let isLecturer = false;
            if (userType === 'lecturer') {
                isLecturer = true;
            }
            
            console.log(isLecturer);
            // Render 'dashboard.ejs' and pass user information or perform actions
            res.render('jobBoard', { userId, username, userType, isLecturer});
            console.log(userId);
            console.log(username);
        }
    });

    log(req, res);
});

// Handle 404 errors by sending the '404.html' file as the response
app.use((req, res) => {
    res.status(404).render('404');
    // Log the request details
    log(req, res);
});
