// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);



const create = document.getElementById('submitButton');
//const login = document.getElementById('submitButton');
create.addEventListener("click", function (event) {
  event.preventDefault()

  //inputs
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
  createUserWithEmailAndPassword(auth, email, password)
  
  .then((userCredential) => {
    window.location.href = "login.html";
    const user = userCredential.user;
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage)
  })
})


/*
login.addEventListener("click", function (event) {
  event.preventDefault()

  //inputs
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
  signInWithEmailAndPassword(auth, email, password)
  
  //window.location.href = 
  .then((userCredential) => {
    alert("Logging In")
    window.location.href = "index.html";
    const user = userCredential.user;
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage)
  })
})
*/

/*const firebaseConfig = {
    apiKey: "AIzaSyDvsS06wEMIc7WW30WxKfmu8R-4xKLJ6Ag",
    authDomain: "volunteen-438f6.firebaseapp.com",
    projectId: "volunteen-438f6",
    storageBucket: "volunteen-438f6.appspot.com",
    messagingSenderId: "651971950022",
    appId: "1:651971950022:web:8709d63dbcbb745125eec7"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig)
  const auth = firebase.auth()
  
  function register () {
    email = document.getElementById('email').value
    password = document.getElementById('password').value
  
    if(validate_pass(password) == false) {
      return
      alert('Password has to be at least 6 characters')
    }
  
    auth.createUserWithEmailAndPassword(email, password)
    .then(function() {
      alert('User Created')
      //window.location.href = 'index.html';
    })
    .catch(function(error) {
      var error_message = error.message
      alert(error_message)
    })
  }
  
  function login() {
    email = document.getElementById('email').value
    password = document.getElementById('password').value
    auth.signInWithEmailAndPassword(email, password).then(
      function() {
        var user = auth.currentUser
        alert("Logged In!")
        //window.location.href = 'index.html';
      })
      .catch(function(error) {
        var error_message = error.message
        alert(error_message)
      })
  }
  
  function validate_pass(password){
    return(password >= 6)
  }
*/