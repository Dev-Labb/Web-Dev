// Data used by the interactive interest selector.
const interestOptions = {
    adoption: {
        title: "Adoption Information",
        message: "You selected adoption information. We will help you learn about available pets and the adoption process."
    },
    foster: {
        title: "Foster a Pet",
        message: "You selected fostering. Foster homes give pets a safe, temporary place to stay while they wait for adoption."
    },
    volunteer: {
        title: "Volunteer With Us",
        message: "You selected volunteering. Volunteers support animal care, events, outreach, transportation, and more."
    }
};

// Data used for clear form validation feedback.
const validationMessages = {
    name: "Please enter your full name using at least two characters.",
    email: "Please enter a valid email address, such as name@example.com.",
    interest: "Please select the type of information you would like to receive.",
    availability: "Please select your availability.",
    experience: "Please describe your experience with pets using at least 10 characters.",
    message: "Please enter a short message using at least 10 characters."
};

// Storage keys keep localStorage names organized.
const storageKeys = {
    interest: "tcraSelectedInterest",
    availability: "tcraAvailability"
};

// This array identifies the form fields checked during validation.
const formFieldIds = [
    "name",
    "email",
    "interest",
    "availability",
    "experience",
    "message"
];


/* Interactive feature functions */

function showInterestDetails(selectedInterest) {
    const result = document.getElementById("interest-result");
    const selectedOption = interestOptions[selectedInterest];

    if (!result || !selectedOption) {
        return;
    }

    result.innerHTML =
        "<strong>" + selectedOption.title + ":</strong> " +
        selectedOption.message;

    updateSelectedButton(selectedInterest);
}

function updateSelectedButton(selectedInterest) {
    const buttons = document.querySelectorAll(".interest-button");

    buttons.forEach(function (button) {
        if (button.dataset.interest === selectedInterest) {
            button.classList.add("selected-interest");
        } else {
            button.classList.remove("selected-interest");
        }
    });
}

function saveInterest(selectedInterest) {
    localStorage.setItem(storageKeys.interest, selectedInterest);
}

function loadSavedInterest() {
    const savedInterest = localStorage.getItem(storageKeys.interest);

    if (savedInterest && interestOptions[savedInterest]) {
        showInterestDetails(savedInterest);
    }
}

function setUpInterestFeature() {
    const buttons = document.querySelectorAll(".interest-button");

    if (buttons.length === 0) {
        return;
    }

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            const selectedInterest = button.dataset.interest;

            showInterestDetails(selectedInterest);
            saveInterest(selectedInterest);
        });
    });

    loadSavedInterest();
}


/* Form validation functions */

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorMessage = document.getElementById(fieldId + "-error");

    if (field && errorMessage) {
        field.setAttribute("aria-invalid", "true");
        errorMessage.textContent = message;
    }
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorMessage = document.getElementById(fieldId + "-error");

    if (field && errorMessage) {
        field.removeAttribute("aria-invalid");
        errorMessage.textContent = "";
    }
}

function validateName() {
    const name = document.getElementById("name");

    if (name.value.trim().length < 2) {
        showError("name", validationMessages.name);
        return false;
    }

    clearError("name");
    return true;
}

function validateEmail() {
    const email = document.getElementById("email");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.value.trim())) {
        showError("email", validationMessages.email);
        return false;
    }

    clearError("email");
    return true;
}

function validateSelection(fieldId) {
    const field = document.getElementById(fieldId);

    if (field.value === "") {
        showError(fieldId, validationMessages[fieldId]);
        return false;
    }

    clearError(fieldId);
    return true;
}

function validateTextArea(fieldId) {
    const field = document.getElementById(fieldId);

    if (field.value.trim().length < 10) {
        showError(fieldId, validationMessages[fieldId]);
        return false;
    }

    clearError(fieldId);
    return true;
}

function validateForm() {
    const nameIsValid = validateName();
    const emailIsValid = validateEmail();
    const interestIsValid = validateSelection("interest");
    const availabilityIsValid = validateSelection("availability");
    const experienceIsValid = validateTextArea("experience");
    const messageIsValid = validateTextArea("message");

    return nameIsValid &&
        emailIsValid &&
        interestIsValid &&
        availabilityIsValid &&
        experienceIsValid &&
        messageIsValid;
}


/* Form storage functions */

function saveFormSelections() {
    const interest = document.getElementById("interest");
    const availability = document.getElementById("availability");

    if (interest) {
        localStorage.setItem(storageKeys.interest, interest.value);
    }

    if (availability) {
        localStorage.setItem(storageKeys.availability, availability.value);
    }
}

function loadFormSelections() {
    const interest = document.getElementById("interest");
    const availability = document.getElementById("availability");
    const savedInterest = localStorage.getItem(storageKeys.interest);
    const savedAvailability = localStorage.getItem(storageKeys.availability);

    if (interest && savedInterest && interestOptions[savedInterest]) {
        interest.value = savedInterest;
    }

    if (availability && savedAvailability) {
        availability.value = savedAvailability;
    }
}

function setUpContactForm() {
    const form = document.getElementById("interest-form");
    const formStatus = document.getElementById("form-status");

    if (!form) {
        return;
    }

    loadFormSelections();

    const interest = document.getElementById("interest");
    const availability = document.getElementById("availability");

    interest.addEventListener("change", saveFormSelections);
    availability.addEventListener("change", saveFormSelections);

    formFieldIds.forEach(function (fieldId) {
        const field = document.getElementById(fieldId);

        field.addEventListener("input", function () {
            if (fieldId === "name") {
                validateName();
            } else if (fieldId === "email") {
                validateEmail();
            } else if (fieldId === "experience" || fieldId === "message") {
                validateTextArea(fieldId);
            }
        });

        field.addEventListener("change", function () {
            if (fieldId === "interest" || fieldId === "availability") {
                validateSelection(fieldId);
            }
        });
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (validateForm()) {
            saveFormSelections();

            formStatus.textContent =
                "Thank you. Your interest form is complete and ready for the rescue team to review.";

            formStatus.classList.remove("form-error-status");
            formStatus.classList.add("form-success-status");
        } else {
            formStatus.textContent =
                "Please correct the fields marked with error messages before submitting.";

            formStatus.classList.remove("form-success-status");
            formStatus.classList.add("form-error-status");
        }
    });
}


/* Start the appropriate JavaScript features after the page loads. */

document.addEventListener("DOMContentLoaded", function () {
    setUpInterestFeature();
    setUpContactForm();
});