
function searchJobs() {
    var input = document.getElementById("jobSearch").value;
    var filter = input.toUpperCase();
    var cardContainer = document.getElementById("jobList");
    var cards = cardContainer.getElementsByClassName("card");

    for (var i = 0; i < cards.length; i++) {
        var title = cards[i].querySelector(".card-title");
        if (title.innerText.toUpperCase().indexOf(filter) > -1) {
            cards[i].style.display = "block";
        } else if (filter == "") {
            cards[i].style.display = "block";
        } else {
            cards[i].style.display = "none";
        }
    }
}


function createJob() {


    var jobTitle = document.getElementById("jobTitle");
    var jobDescription = document.getElementById("jobDescription");
    var jobPay = document.getElementById("jobPay");
    var jobLocation = document.getElementById("jobLocation");
    console.log(jobTitle.value, jobDescription.value, jobLocation.value, jobPay.value);
    // make a post request to the server to create a job
    fetch("jobs/createJob", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: jobTitle.value,
            description: jobDescription.value,
            location: jobLocation.value,
            pay: jobPay.value
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        location.reload();
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function JobSwitch() {
    var form = document.querySelector("form");
    var createJobBtn = document.getElementById("createJob");
    var form = document.querySelector("form");
    if (form.style.display === "block") {
        form.style.display = "none";
        createJobBtn.innerHTML = "Create Job";
    } else {
        form.style.display = "block";
        createJobBtn.innerHTML = "Stop Creating";
    }
}

function submitJob(event) {
    var jobTitle = document.getElementById("jobTitle").value;
    var jobDescription = document.getElementById("jobDescription").value;
    var jobLocation = document.getElementById("jobLocation").value;
    var jobPay = document.getElementById("jobPay").value;

    // Check if any of the required fields is empty
    if (jobTitle == "" || jobDescription == "" || jobLocation == "" || jobPay == "") {
        alert("Please fill in all the required fields");
        return;
    }

    // You should also check if the required fields are not empty before proceeding
    var jobContainer = document.getElementById("jobList");
    var row = document.getElementById("row");
    var jobCard = document.createElement("div");
    jobCard.classList.add("col-md-4");
    jobCard.innerHTML = `
        <div class="col=md-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${jobTitle}</h5>
                    <p class="card-text">${jobDescription}</p>
                    <p class="card-text">Location: ${jobLocation}</p>
                    <p class="card-text">Salary: ${jobPay}</p>
                    <a href="#" class="btn btn-primary">Apply</a>
                </div>
            </div>
        </div>
    `;
    row.appendChild(jobCard);
    jobContainer.appendChild(row);

    document.querySelector("form").reset();

    createJob(); // Optional: Close the form after submission

    

}

