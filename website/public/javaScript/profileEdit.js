
function editProfile() {
    var form = document.querySelector("form");
    var editProfileBtn = document.getElementById("editProfile");

    if (form.style.display === "block") {
        form.style.display = "none";
        editProfileBtn.innerHTML = "Edit Profile";
    } else {
        form.style.display = "block";
        editProfileBtn.innerHTML = "Stop Editing";
    }
}

function updateProfile(event) {
    event.preventDefault(); // Prevents the default form submission behavior

    var newWorkHistory = document.getElementById("workHistory").value;
    var newEducationHistory = document.getElementById("educationHistory").value;
    var newSkills = document.getElementById("skills").value;
    var workHistoryText = document.getElementById("workHistoryText");
    var educationHistoryText = document.getElementById("educationHistoryText");
    var skillsText = document.getElementById("skillsText");
    


    workHistoryText.innerHTML = newWorkHistory;
    educationHistoryText.innerHTML = newEducationHistory;
    skillsText.innerHTML = newSkills;

    // get the photo from the form and send it to the server
    var photo = document.getElementById("profilePic").files[0];
    // make a request to the server to update the profile
    var formData = new FormData();
    formData.append("photo", photo);
    formData.append("workHistory", newWorkHistory);
    formData.append("educationHistory", newEducationHistory);
    formData.append("skills", newSkills);

    fetch("/updateProfile", {
        method: "POST",
        body: formData
    }).then((res) => res.json()).then((data) => {
        console.log(data);
    }).catch((e) => console.error(e));
}
