// Firebase Configuration 
const firebaseConfig = {
    apiKey: "AIzaSyCJNWiDUrIQz1wYh23E30gd-6o2YR64E9E",
    authDomain: "login-passwordd.firebaseapp.com",
    projectId: "login-passwordd",
    storageBucket: "login-passwordd.appspot.com",
    messagingSenderId: "99718240537",
    appId: "1:99718240537:web:186019de62dd1d3c17cd88"
};

// Function to show messages
function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// Sign Up with Email and Password
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    const apiKey = firebaseConfig.apiKey;
    const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

    fetch(authUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true
        })
    })
    .then(response => response.json())
    .then((data) => {
        if (data.error) {
            if (data.error.message === 'EMAIL_EXISTS') {
                showMessage('Email Address Already Exists !!!', 'signUpMessage');
            } else {
                showMessage('Unable to create user', 'signUpMessage');
            }
            return;
        }

        const userId = data.localId;
        const userData = {
            email: email,
            firstName: firstName,
            lastName: lastName
        };
        showMessage('Account Created Successfully', 'signUpMessage');
        
        // Saving user data to Firestore via REST API
        const dbUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/users/${userId}?key=${apiKey}`;
        fetch(dbUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    email: { stringValue: email },
                    firstName: { stringValue: firstName },
                    lastName: { stringValue: lastName }
                }
            })
        })
        .then(() => {
            window.location.href = 'login.html';
        })
        .catch((error) => {
            console.error("Error writing document", error);
        });
    })
    .catch((error) => {
        console.error("Error creating user", error);
    });
});

// Sign In with Email and Password
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const apiKey = firebaseConfig.apiKey;
    const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    fetch(authUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true
        })
    })
    .then(response => response.json())
    .then((data) => {
        if (data.error) {
            const errorCode = data.error.message;
            if (errorCode === 'INVALID_PASSWORD' || errorCode === 'EMAIL_NOT_FOUND') {
                showMessage('Incorrect Email or Password', 'signInMessage');
            } else {
                showMessage('Account does not exist', 'signInMessage');
            }
            return;
        }

        showMessage('Login is successful', 'signInMessage');
        const userId = data.localId;
        localStorage.setItem('loggedInUserId', userId);

        // Check if the user is an admin
        checkAdmin(email);
    })
    .catch((error) => {
        console.error("Error signing in", error);
    });
});

// Function to check if the logged-in user is an admin
async function checkAdmin(email) {
    const apiKey = firebaseConfig.apiKey;
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/admins?key=${apiKey}`;

    console.log('Checking admin status for email:', email); // Log the email being checked

    try {
        const adminResponse = await fetch(firestoreUrl);
        const adminData = await adminResponse.json();

        // Check if the request was successful
        if (!adminResponse.ok) {
            throw new Error(`Failed to fetch admins: ${adminData.error.message}`);
        }

        // Ensure adminData.documents exists before proceeding
        if (adminData.documents) {
            // Check if the email exists in the admin list
            const isAdmin = adminData.documents.some(doc => {
                const adminEmail = doc.fields.email.stringValue;
                return adminEmail === email;
            });

            if (isAdmin) {
                console.log('Admin access granted');
                window.location.href = '../Admin/admin.html'; // Redirect to admin dashboard
            } else {
                console.log('Regular user access granted');
                window.location.href = '../Home/index.html'; // Redirect to user dashboard
            }
        } else {
            throw new Error("No admin data found.");
        }
    } catch (error) {
        console.error('Error checking admin status:', error);
        alert(`An error occurred while verifying admin status: ${error.message}`);
    }
}

// Sign In with Google (OAuth2)
const googleSignIn = document.getElementById('googleSignIn');
googleSignIn.addEventListener('click', () => {
    const apiKey = firebaseConfig.apiKey;
    const googleSignInUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=99718240537-2577np56vj4fnceo2ijgiiaft80o23ku.apps.googleusercontent.com&redirect_uri=http://127.0.0.1:5500/&response_type=token&scope=email%20profile`;
    window.location.href = googleSignInUrl;
});

// Handle Google OAuth Redirect (Processing the Token)
function handleGoogleRedirect() {
    const hashParams = new URLSearchParams(window.location.hash.substring(1)); // Extract params from the URL fragment
    const accessToken = hashParams.get('access_token');

    if (accessToken) {
        // Exchange Google OAuth Token with Firebase IdToken
        const apiKey = firebaseConfig.apiKey;
        const googleTokenUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${apiKey}`;

        fetch(googleTokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                postBody: `id_token=${accessToken}&providerId=google.com`,
                requestUri: window.location.href,
                returnSecureToken: true,
                returnIdpCredential: true
            })
        })
        .then(response => response.json())
        .then((data) => {
            if (data.error) {
                showMessage('Google sign-in failed!', 'signInMessage');
                return;
            }

            const userId = data.localId;
            localStorage.setItem('loggedInUserId', userId);
            showMessage('Google sign-in successful!', 'signInMessage');
            window.location.href = '';
        })
        .catch((error) => {
            console.error("Google sign-in error", error);
        });
    }
}

// Call handleGoogleRedirect on page load to process token
if (window.location.hash) {
    handleGoogleRedirect();
}
