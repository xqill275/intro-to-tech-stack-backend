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

// authController.createJob

exports.createJob = async (req, res) => {
    // {jobTitle, jobDescription, jobPay, jobLocation}
    console.log("we are here (createJob)");
    const { title, description, location, pay } = req.body;
    console.log(title, description, location, pay); // Use correct variable names

    const insertQuery = 'INSERT INTO jobBoard (jobTitle, jobDescription, jobLocation, jobPay) VALUES (?, ?, ?, ?)';
    await db.query(insertQuery, [title, description, location, pay], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log(results);
            res.json({ message: 'Job created' });
        }
    });
}

exports.getJobs = async (req, res) => {
    db.query('SELECT * FROM jobBoard', (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
           const jobs = JSON.parse(JSON.stringify(results));
            res.json(jobs);
        }
    });
}






