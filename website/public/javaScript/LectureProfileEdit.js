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

    var companyText = document.getElementById("CompanyText");
    var contactText = document.getElementById("ContactText");

    // Additional updates for Company / University and Contact Information
    companyText.innerHTML = document.getElementById("companyUniversity").value;
    contactText.innerHTML = document.getElementById("contactInfo").value;
}
