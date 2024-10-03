const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');
const signInForm = document.getElementById('signIn');
const signUpForm = document.getElementById('signup');

// Event listener for sign-up button
signUpButton.addEventListener('click', function () {
    signInForm.style.display = "none"; // Hide sign-in form
    signUpForm.style.display = "block"; // Show sign-up form
});

// Event listener for sign-in button
signInButton.addEventListener('click', function () {
    signUpForm.style.display = "none"; // Hide sign-up form
    signInForm.style.display = "block"; // Show sign-in form
});

// Optional: Initialize forms on page load
document.addEventListener('DOMContentLoaded', function() {
    signInForm.style.display = "block"; // Show sign-in form by default
    signUpForm.style.display = "none"; // Hide sign-up form by default
});
function onLoad() {
    gapi.load('auth2', function() {
        gapi.auth2.init({
            client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com'
        });
    });
}

function onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId());
    console.log('Name: ' + profile.getName());
    console.log('Email: ' + profile.getEmail());
}

// Call onLoad on window load
window.onload = onLoad;
