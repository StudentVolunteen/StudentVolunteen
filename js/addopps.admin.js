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
  //Check
  //Initialize services
  const db = getFirestore()
  const auth = getAuth(app);
  const user = localStorage.getItem("storageName");




  const create = document.getElementById('submitButton');
create.addEventListener("click", (e) => {
    const title = document.getElementById('firstName').value;
    const description = document.getElementById('addDescription').value;
    const email = document.getElementById('supervisorMail').value;
    const password = document.getElementById('password').value;
    if(user === "admin@gmail.com"){
        alert("" + title + description + email + password)
    addDoc(collection(db, "Events"), {
        title: title,
        description: description,
        email: email,
        password: password,
    })
    } else {
        alert("You have to be an admin to make an event!");
    }
    
})