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

exports.updateProfile = async (req, res) => {
    console.log(req.body);
    const { workHistory, educationHistory, skills } = req.body;
    console.log(workHistory, educationHistory, skills);
    const token = req.cookies.jwt;
    const userId = await getID(token);

    const profileData = {
        UserID: userId,
        WorkHistory: workHistory,
        EducationHistory: educationHistory,
        Skills: skills
    };

    const sql = `
        INSERT INTO userProfiles (UserID, WorkHistory, EducationHistory, Skills)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        WorkHistory = VALUES(WorkHistory),
        EducationHistory = VALUES(EducationHistory),
        Skills = VALUES(Skills)
    `;

    db.query(sql, [userId, workHistory, educationHistory, skills], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log(results);
            res.json({ message: 'Profile updated' });
        }
    });
};


exports.getProfileData = async (req, res) => {
    const token = req.cookies.jwt;
    const userId = await getID(token);
    console.log("User ID: " + userId);

    db.query('SELECT * FROM userProfiles WHERE UserID = ?', [userId], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            console.log(results);
            res.json(results);
        }
    });
}

function getID(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log(decodedToken);
                resolve(decodedToken.userID);
            }
        });
    });
}