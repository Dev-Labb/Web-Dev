/*
   This is for the  Twin Cities Animal Rescue - Touchstone 4 JavaScript

    This script provides three main website improvements:

    1. An interactive for a "Choose Your Next Step" feature on the index html page.
       Visitors can select adoption, fostering, or volunteering options.

    2. Custom form validation on contact.html.
       Adds errors for the form fields to help visitors correct mistakes or see errors.

    3. Browser storage with localStorage.
       The site remembers a visitor's interest type and availability
       after they refresh the page or return later.
*/

/*
    This stores the title and message for each
    possible interest option. The interactive buttons use
    these keys: adoption, foster, and volunteer and delivers
    messages accordingly.
*/

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

/*
    This stores the validation messages shown
    when a visitor enters incomplete or incorrect form information.
*/

const validationMessages = {
    name: "Please enter your full name using at least two characters.",
    email: "Please enter a valid email address, such as name@example.com.",
    interest: "Please select the type of information you would like to receive.",
    availability: "Please select your availability.",
    experience: "Please describe your experience with pets using at least 10 characters.",
    message: "Please enter a short message using at least 10 characters."
};

/*
    This object stores the localStorage key names used by the site.
    Using named keys prevents spelling mistakes and keeps storage organized.
*/

const storageKeys = {
    interest: "tcraSelectedInterest",
    availability: "tcraAvailability"
};

/*
    This array lists all Contact form field IDs.
    I combined it with event listeners
*/

const formFieldIds = [
    "name",
    "email",
    "interest",
    "availability",
    "experience",
    "message"
];

/*
    Updates the Home page after a visitor chooses adoption,
    fostering, or volunteering.

    This function finds the matching option in interestOptions,
    updates the text shown in the interest-result paragraph,
    and highlights the button the visitor selected.
*/
function showInterestDetails(selectedInterest) {
    const result = document.getElementById("interest-result");
    const selectedOption = interestOptions[selectedInterest];

    /*
        Stops the function if this page does not contain the result
        area or if the selected interest is not a valid option.
    */
    if (!result || !selectedOption) {
        return;
    }

    /*
        Displays the title and matching description dynamically.
        The visitor sees the updated message immediately after clicking.
    */
    result.innerHTML =
        "<strong>" + selectedOption.title + ":</strong> " +
        selectedOption.message;

    updateSelectedButton(selectedInterest);
}

/*
    Adding a visual style to the selected interest button.

    Only the currently selected button receives the
    selected-interest CSS class. Other buttons have that
    class removed so visitors can clearly see their current choice.
*/
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

/*
    Saves the visitor's adoption, foster, or volunteer selection
    in localStorage. The selection stays available after the
    visitor refreshes the page or navigates to contact.html.
*/
function saveInterest(selectedInterest) {
    localStorage.setItem(storageKeys.interest, selectedInterest);
}

/*
    Checks localStorage when the Home page opens.

    If the visitor previously chose an interest option, the site
    restores the saved message and highlights the saved button.
*/
function loadSavedInterest() {
    const savedInterest = localStorage.getItem(storageKeys.interest);

    if (savedInterest && interestOptions[savedInterest]) {
        showInterestDetails(savedInterest);
    }
}

/*
    Sets up the interactive buttons on index.html.

    Each button has a click event listener. When clicked,
    the site identifies the selected option, updates the visible
    information, and saves the selection in localStorage.
*/
function setUpInterestFeature() {
    const buttons = document.querySelectorAll(".interest-button");

    /*
        This check allows the script.js file to be used on
        all website pages. Services, About, and Contact do not
        have interest buttons, so the function safely stops there.
    */
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

/*
    Displays a custom error message next to a specific form field.

    The related field receives aria-invalid="true", which helps
    with accessability and to identify if that the field contains an error.
*/

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorMessage = document.getElementById(fieldId + "-error");

    if (field && errorMessage) {
        field.setAttribute("aria-invalid", "true");
        errorMessage.textContent = message;
    }
}

/*
    Clears the error message for a field after the visitor
    corrects their input. It also removes aria-invalid.
*/
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorMessage = document.getElementById(fieldId + "-error");

    if (field && errorMessage) {
        field.removeAttribute("aria-invalid");
        errorMessage.textContent = "";
    }
}

/*
    Validates the Name field.

    A visitor must enter at least two non-space characters.
*/
function validateName() {
    const name = document.getElementById("name");

    if (name.value.trim().length < 2) {
        showError("name", validationMessages.name);
        return false;
    }

    clearError("name");
    return true;
}

/*
    Validates the Email field.

    The regular expression checks whether the email includes
    text before and after an @ symbol, plus a domain ending.
*/
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

/*
    Validates one of the required drop-down menus.

    This function is used for both the Interest and Availability
    menus because both need the visitor to select a non-empty option.
*/
function validateSelection(fieldId) {
    const field = document.getElementById(fieldId);

    if (field.value === "") {
        showError(fieldId, validationMessages[fieldId]);
        return false;
    }

    clearError(fieldId);
    return true;
}

/*
    Validates a textarea field.

    The Experience with Pets and Short Message textareas each
    require at least 10 non-space characters.
*/
function validateTextArea(fieldId) {
    const field = document.getElementById(fieldId);

    if (field.value.trim().length < 10) {
        showError(fieldId, validationMessages[fieldId]);
        return false;
    }

    clearError(fieldId);
    return true;
}

/*
    Runs every form validation check when the visitor submits
    the Contact form.

    The form is valid only if every individual validation function
    returns true.
*/
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


/*
    Saves the visitor's selected Interest and Availability values
    in localStorage.
*/
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

/*
    Restores saved Interest and Availability values when the
    Contact page opens or reloads.

    For example, a visitor who chose "Foster" on the Home page
    will see Fostering already selected in the Contact form.
*/
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

/*
    Sets up Contact form validation and browser storage.

    This function:
    - Restores previously saved form selections.
    - Saves interest and availability after a visitor changes them.
    - Validates fields as the visitor corrects errors.
    - Prevents invalid form submission.
    - Shows either an error summary or a success message.
*/
function setUpContactForm() {
    const form = document.getElementById("interest-form");
    const formStatus = document.getElementById("form-status");

    /*
        This check allows script.js to run safely on pages that
        do not contain the Contact form.
    */
    if (!form) {
        return;
    }

    loadFormSelections();

    const interest = document.getElementById("interest");
    const availability = document.getElementById("availability");

    /*
        Save the visitor's selections whenever either drop-down menu changes.
    */
    interest.addEventListener("change", saveFormSelections);
    availability.addEventListener("change", saveFormSelections);

    /*
        Add live validation to each field.

        Text fields and textareas validate while the visitor types.
        Drop-down menus validate when the visitor changes their selection.
    */
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

    /*
        Runs when the visitor selects the form's submit button.

        preventDefault stops the form from submitting and reloading
        the static class website. If all fields are valid, the visitor
        receives a success message. If not, they receive an instruction
        to correct the marked fields.
    */
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


/*
    Waits until all HTML on the current page has loaded before
    trying to find buttons, forms, or page elements.

    The same file runs on every page. Each setup function checks
    whether its needed HTML elements exist before doing anything.
*/
document.addEventListener("DOMContentLoaded", function () {
    setUpInterestFeature();
    setUpContactForm();
});