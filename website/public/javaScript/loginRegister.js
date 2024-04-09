document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Delete the cookie
// Function to show the registration form and hide the login form
function showReg() {
    var register = document.getElementById("register-container");
    var login = document.getElementById("login-container");

    // Display the registration form
    register.style.display = "block";
    // Hide the login form
    login.style.display = "none";
}

// Function to handle the login process
function login() {
    // Fetch the content of the 'myText.txt' file
    fetch("./files/myText.txt").then((res) => res.text()).then((text) => {
        // Split the file content into an array
        var fileText = text.split("");
        // Fix the array format
        var validLogin = fixArray(fileText);

        // Get the username and password from the login form
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        console.log(username);

        // Check if the username is in the file
        if (validLogin.includes(username)) {
            // If it is, get the index of the username and check if the password is correct
            var userIndex = validLogin.indexOf(username);
            console.log(userIndex);
            
            if (password == validLogin[userIndex + 1]) {
                // Check if the user is a student or lecturer and log them in
                var studentOrLecturer = validLogin[userIndex + 2];
                alert("Logged in as " + username + " and they are a " + studentOrLecturer);
                if (studentOrLecturer == "lecturer") {
                    document.cookie = "type=lecturer";
                } else {
                    document.cookie = "type=student";
                }
                if (studentOrLecturer == "lecturer") {
                    window.location.href = "./lecturerUserPage";
                } else {
                    window.location.href = "./studentUserPage";
                }                
            } else {
                alert("Incorrect Username or Password");
            }
        } else {
            alert("Incorrect Username or Password");
        }
    }).catch((e) => console.error(e));
}

// Function to fix the format of the array
function fixArray(array) {
    var temp = "";
    var newArray = [];

    // Loop through the array and add the values to the new array
    for (var i = 0; i < array.length; i++) {
        // If it is "\r\n", then we know we have reached a space, so add the word to the new array and reset the temp variable
        if (array[i] == "\r" && array[i + 1] == "\n") {
            newArray.push(temp);
            temp = "";
            i += 2;
        }
        // Add the letter to the temp variable
        temp += array[i];
    }

    // Add the last word to the new array
    newArray.push(temp);
    temp = "";
    console.log(newArray);

    return newArray;
}

// Function to handle the registration process
function register() {
    console.log("Registering");
    var registerForm = document.getElementById("registerForm");
    var student = registerForm.elements[0].checked;
    var username = registerForm.elements[3].value;
    var password = registerForm.elements[4].value;

    // Check if the user is a student or lecturer
    var userType = student ? "student" : "lecturer";

    // make a post request to the server
    fetch('http://localhost:3000/auth/register', { // Updated URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, userType }), // Send the username, password and userType to the server
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        console.log('Response:', data);
        // Optionally, redirect user to login page or show a success message
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle error, show error message to user, etc.
    });
}


// Function to send a post request to the server and write to a file
function writeToFile(text, file) {
    fetch('http://localhost:3000/writeToFile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, file }), // Send the text and file to the server
    })
        .then((res) => res.text()) // Get the response
        .then((data) => {
            console.log(data);
        })
        .catch((error) => console.error('Error:', error)); // Log any errors
}


function validateForm() {
    // Add your validation logic here
    // For example, you can check if all required fields are filled

    var userType = document.querySelector('input[name="userType"]:checked');
    if (!userType) {
        alert('Please select a user type');
        return false;
    }

    return true; // Return true if form is valid, false otherwise
}
