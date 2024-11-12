// Import the functions you need from the SDKs you need
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDvsS06wEMIc7WW30WxKfmu8R-4xKLJ6Ag",
    authDomain: "volunteen-438f6.firebaseapp.com",
    projectId: "volunteen-438f6",
    storageBucket: "volunteen-438f6.appspot.com",
    messagingSenderId: "651971950022",
    appId: "1:651971950022:web:8709d63dbcbb745125eec7"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

// function writeUserData(userId, name, email) {
//   app.database().ref('users').set(ref(db, 'users/' + userId), {
//   username: name,
//   email: email
//   });
// }



// writeUserData(1, "tester", "test@gmail.com");


login.addEventListener("click", function (event) {
    event.preventDefault()
  
    //inputs
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, password)
    
    //window.location.href = 
    .then((userCredential) => {
      localStorage.setItem("storageName", email);
      window.location.href = "index.login.html";
      const user = userCredential.user;

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)
    })
  })