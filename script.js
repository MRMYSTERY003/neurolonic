import { initializeApp, getApps, getApp  } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore , collection, addDoc  } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


const firebaseConfig = {
apiKey: "AIzaSyAq7bE-2Lo6qsiD9fgXCzi8xTny1aFsyAc",
authDomain: "neurolonic.firebaseapp.com",
projectId: "neurolonic",
storageBucket: "neurolonic.firebasestorage.app",
messagingSenderId: "1070601097535",
appId: "1:1070601097535:web:e0cbc3e16a48b78954038a",
measurementId: "G-6NLNB7MNF9"
};


let app;
app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth();
const db = getFirestore(app);

console.log(app.name ? "Firebase Mode Activated!" : "Firebase not working :(");


console.log("loaded")




// Get modal elements
const modal = document.getElementById("privacyModal");
const agreeButton = document.getElementById("agreeButton");
const closeButton = document.querySelector(".close");













const login_btn = document.getElementById("login");
const register_btn = document.getElementById("register");
const new_user = document.getElementById("new-user");
const username = document.getElementById("uname");
const ph = document.getElementById("ph");

// Show modal on Register button click
register_btn.addEventListener('click', () => {
    modal.style.display = "block";
});

// Close modal when "X" is clicked
closeButton.onclick = function() {
    modal.style.display = "none";
};

// Close modal if clicked outside content
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};



new_user.addEventListener('click', ()=>{
    const username = document.getElementById("uname");
    const ph = document.getElementById("ph");


    // username.style.display = "block";
    // register_btn.style.display = "none"

    if (username.style.display === "none" || username.style.display === "") {
        username.style.display = "block";
        ph.style.display = "block";
        login_btn.style.display = "none"
    } else {
        username.style.display = "none";
        ph.style.display = "none";
        login_btn.style.display = "block"

    }

    
    if (register_btn.style.display === "none" || register_btn.style.display === "") {
        register_btn.style.display = "block";
    } else {
        register_btn.style.display = "none";
    }

})

const url = 'https://neurolonic-default-rtdb.firebaseio.com/users/';

function findKeyByEmail(data, targetEmail) {
    for (const [key, value] of Object.entries(data)) {
        if (value.email === targetEmail) {
            return key; // Return the key if the email matches
        }
    }
    return null; // Return null if no match is found
}


// Function to handle login
async function loginUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email, password)

    var ph, flag = 0;

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    await makeRequest(url+'.json')
            .then(data => {
                const result = findKeyByEmail(data, email);
                console.log(result)
                ph = result
                flag = 1;
            })
            .catch(error => console.error("Error:", error));

        if(flag == 1){
            window.location.href = "home.html?t="+ph; 
        }




}


async function makeRequest(url, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: data ? JSON.stringify(data) : null
        };

        const response = await fetch(url, options);

        // Check if the response was successful
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        // Parse and return JSON if the response has content
        if (response.status !== 204) {
            return await response.json();
        } else {
            return 'No Content';
        }
    } catch (error) {
        console.error("Request failed:", error);
        return null;
    }
}


// Function to handle registration
async function registerUser() {
    modal.style.display = "none";
    const username = document.getElementById("uname").value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const ph = document.getElementById('ph').value;
    console.log("Email:", email, "Password:", password);

    try {
        // Step 1: Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User created:", user);

        // Step 2: Add user data to Firestore
        // const docRef = await addDoc(collection(db, "users"), {
        //     username: username,
        //     email: email,
        //     phone: ph
        // });
        // console.log("Document written with ID:", docRef.id);

        const updateData = {
            username: username,
            email : email,
            phone : ph,
        };
        
        await makeRequest(url+user+'.json', 'PUT', updateData)
            .then(response => console.log("PUT Response:", response))
            .catch(error => console.error("Error:", error));


        // Step 3: Redirect to home page only after successful registration


        window.location.href = "home.html?t="+ph;

    } catch (error) {
        console.error("Error in registration:", error);
        alert("Error: " + error.message);
    }
}


login_btn.addEventListener('click', ()=>{
    loginUser() 
})


agreeButton.addEventListener('click', ()=>{
    registerUser()
})