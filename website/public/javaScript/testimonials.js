// Function to asynchronously fetch testimonials from a JSON file
async function getTestimonials() {
    const response = await fetch('./json/testimonials.json'); // Fetch the data
    const testimonials = await response.json(); // Convert the data to JSON
    return testimonials; // Return the data
}

// Function to load a random testimonial onto the page
async function loadRandomTestimonial() {
    const testimonials = await getTestimonials(); // Get the testimonials
    const randomIndex = Math.floor(Math.random() * testimonials.length); // Get a random index
    
    const testimonialText = document.getElementById('testimonialText'); // Get the testimonial text element
    const testimonial = testimonials[randomIndex]; // Get the testimonial at the random index

    // Set the testimonial text using HTML with the name and quote from the testimonial
    testimonialText.innerHTML = `<strong>${testimonial.name}</strong>: "${testimonial.quote}"`;
}

// Load a random testimonial when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', loadRandomTestimonial);


window.onload = function () {
    var button = document.getElementById("UserButton");
    console.log(button);
    if (document.cookie == "") {
        button.style.display = "none";
    } else {
        button.style.display = "block";
        if (document.cookie == "UserType=student") {
            button.setAttribute("href", "/studentUserPage");
        } else if (document.cookie == "UserType=lecturer") {
            button.setAttribute("href", "/lecturerUserPage");
        }
    }
}

