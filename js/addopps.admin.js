import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, getDoc, addDoc, collection, setDoc } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';
import { getAuth} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyDvsS06wEMIc7WW30WxKfmu8R-4xKLJ6Ag",
    authDomain: "volunteen-438f6.firebaseapp.com",
    projectId: "volunteen-438f6",
    storageBucket: "volunteen-438f6.appspot.com",
    messagingSenderId: "651971950022",
    appId: "1:651971950022:web:8709d63dbcbb745125eec7"
  };
  
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const user = localStorage.getItem("storageName");
const role = localStorage.getItem('volunteen_current_role');
const permissions = JSON.parse(localStorage.getItem('volunteen_current_permissions') || '[]');
const hasSubAdminPermission = permissions.includes('sub-admin') || role === 'supervisor';

const create = document.getElementById('submitButton');
create.addEventListener("click", async (e) => {
    e.preventDefault();

    const title = document.getElementById('firstName').value;
    const description = document.getElementById('addDescription').value;
    const email = document.getElementById('supervisorMail').value;
    const password = document.getElementById('password').value;

    if (!title || !description || !email || !password) {
        alert("Please fill in all fields!");
        return;
    }

    if (hasSubAdminPermission) {
        try {
            await addDoc(collection(db, "Events"), {
                title,
                description,
                email,
                password,
                createdAt: new Date().toISOString()
            });
            alert("Event created successfully!");
            // Redirect to opportunities page to see the new event
            window.location.href = 'opportunities.login.html';
        } catch (err) {
            console.error("Error writing document: ", err);
            alert("Failed to create event: " + err.message);
        }
    } else {
        alert("You have to be a sub-admin to make an event!");
    }
});