# Oliver Long

# Project Overview


## Project Goals and Objectives
My main goal for this project was to enhance my website from last semester by implementing the backend functionalities. This involved incorporating features such as user registration, login, job board, and user profiles, all stored within my database. 
## Installation instructions
The only dependency for this project is Node.js. To install Node.js, please visit this page:
```
https://nodejs.org/en/download
```
Select the version for your operating system and follow the instructions the installer shows you. I use the Express package, but as you pull this repo down, it is already installed and configured.

Now that Node.js is installed, download this repo onto your system. You can do this by either:
Clicking the code button on the top right-hand side, then Clicking one of the download buttons, or you can git this down by:
```
git clone https://github.com/xqill275/introduction-to-tech-stack-website-project
```
Once you have a copy of my project on your computer, to start the website:

1. enter the website folder:

for windows:
```
cd .\website\
```
for mac and linux:
```
cd /website
```
Now, you need to launch the app.js file with Node.js. To do this, simply enter:
```
node .\app.js
```
Now that you have launched this, you should see the text:
```
Listening for requests on port 3000
```
If you see this, it means that the website is now being hosted on your localhost on port 3000. Now, go to your browser of choice and search for the website:
```
http://localhost:3000/
```

## Project Plan
I decided to rank each feature on its importance in getting it working, and then proceeded to work on each section in that order:

Registration:
This was the first thing I started to work on, and it set the tone for how I was going to approach the rest of the project. I had already implemented a basic version of this, so I was somewhat confident about how to transfer data from my app.js to the webpage.

Logging in:
Now that I had registration working, I decided to focus on enabling users to log in to their accounts. This was fairly straightforward, as I had already learned how to receive data from my database while addressing an issue with registration.

Profile Info:
Once users were able to log in, the next feature I worked on was enabling them to update their data on their dashboard. This was relatively easy, as I had already worked on submitting data to my database while implementing registration.

Job Board:
The final task was to allow users to submit jobs. This was similar to profile info, and retrieving all the jobs was like retrieving user data after logging in.
## Choice of Tech Stack and Architecture

### Technologies Used

This project was built using a simple tech stack: HTML, CSS, JavaScript, and Node.js:

- **Node.js:**
  - What I used to handle the requests and resonses to and from the server

  **Exspress.js:**
  - a web framwork which helps with routing and middleware

   **Mysql:**
  - used for my database which stores everything

  **Json Web Tokens:**
  - used so that i can securly store infomation about the current logged in account

 **Handlebars:**
  - Used as the HTML engine which generate HTML content based on data from the server, allowing for the same page to act diffrently depending on the request from the server .

## Future considerations for scaling
I have now implemented all the items mentioned in last semester's considerations for scaling. As for future enhancements, the only addition I can think of is the ability to upload a profile picture. However, I am satisfied with the current state of the project overall.

## Risk Assessment
Now that I have implemented a backend, the main risks revolve around web vulnerabilities, particularly in the way I authenticate users. Authentication is achieved using JSON Web Tokens (JWT), which poses a risk of security vulnerabilities if the tokens are not properly managed or if there are flaws in the JWT implementation. Additionally, since I am now using SQL, I need to ensure that I am properly sanitizing my inputs to prevent SQL injections and unauthorized data access. Finally, there is a potential for cross-site scripting, especially in how I handle my routes. It's crucial to sanitize user input to prevent the execution of any JavaScript code by the server
## In-code documentation for key functions and components

**register**
 ```js
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
```
This function, is how i regester users i do this by:
first getting all the data from the request, it then checks if the user that was entered already exsists, it sends the message that the user already exists, if it dosent it encrypts the password and then store all the data into the database

**LogIn**
 ```js
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
```
this function allows the user to login, first it gets all the data the user had inputed, it then checks that the username is in the database, if it is then it encrypts the password the user entered and then compares it to the one in the database, finally it then creates a jwt token and then sends the user to the dashboard

if anything goes wrong then it tells the user what went wrong

**logOut**
 ```js
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
```

This simply gets the token assigned to the user and then gives the token expires variable a new date of now, so that it is destroyed, it then redirects the user back to the home page

**create job**
 ```js
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
```
This is simular to the register where it just takes the user input and puts it into the database

**Get Jobs**

 ```js
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
```
this one is the most simple, it just selects all the jobs in the database and then puts it into a json format and then sends that off as a response when it receives a request

 ```js

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

```

when the user wants to edit there profile, when they subbmit all there data this function will make sure there changes are saved onto the database, like always it gets all the user inputs and then the database checks if foreign key of the userID exsists if it dose the new infomation simply is updated but if it dosent then a new colloum on the database is created and the info is stored there

**Get User Profile Data**

 ```js

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
```
when we goto the dashboard the webpage makes a request for the users data, it simply gets the userID from the jwt token and then just selects all the data from the database and then sends it back to the webpage

**get userID**
 ```js
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
```

when ever we need to get the current logged in usersID we call this function which just decodes the jwt token using the secret key which is stored in the enviroment variables, the once it is decoded we can then send of the userID where ever we need to send it.


## ## Legal and ethical considerationts

The main law that I will have to consider the most is the General Data Protection Regulation (GDPR) (Eur-Lex n.d). As I stated previously, my implementation of the login and registering processes does not meet GDPR standards. Additionally, as I am collecting fairly personal information such as names, previous jobs, etc., I need to ensure that this information is stored safely and securely. Another law I will have to ensure I am following is copyright law in the Designs and Patents Act 1988 (Gov.uk, 7/7/11), especially if I'm going to be using any pictures and people's job postings. If they are not posting it themselves, I would need to make sure that I am getting permission. Another requirement I want to meet is accessibility (Government Analysis Function, 29/10/2020), such as making sure that the fonts and colours I am using are easy to read. I would like to focus on this one, as if I were to make this a real project, I would want the most amount of people to be able to use it.



## refrences
Eur-Lex. (N.D) EUR-Lex - 32016R0679 - en - EUR-lex https://eur-lex.europa.eu/eli/reg/2016/679/oj
Gov.uk. (7/7/2011). Copyright Act. https://www.gov.uk/government/publications/copyright-acts-and-related-laws
Government Analysis Function (29/10/2020). Accessibility legislation: what you need to know . https://analysisfunction.civilservice.gov.uk/policy-store/accessibility-legislation-what-you-need-to-know/
