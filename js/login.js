const accountEmail = document.querySelector('.account-email');
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
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



//const create = document.getElementById('register');
const login = document.getElementById('submitButton');
//create.addEventListener("click", function (event) {
  //event.preventDefault()

  //inputs
//const email = document.getElementById('email').value;
//const password = document.getElementById('password').value;
  //createUserWithEmailAndPassword(auth, email, password)
  
  //.then((userCredential) => {
    //alert("Creating Account")
    //window.location.href = "about.html";
    //const user = userCredential.user;
  //})
  //.catch((error) => {
    //const errorCode = error.code;
    //const errorMessage = error.message;
    //alert(errorMessage)
  //})
//})

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

const logout = document.getElementById('logoutButton');
logout.addEventListener('click', (event) => {
  window.location.href = "login.html";
});
/* logout.addEventListener('click', (event) => {
  event.preventDefault();
  auth.signOut().then(() => {
    window.location.href = "login.html";
  }).catch((error) => {
    console.error("Logout error:", error);
  });
}); */

//${userCredential.email}

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
// import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// // Initialize Firebase (assuming this is already done in your app)
// const database = getDatabase();
// const auth = getAuth();

// // Event listener for the submit button
// document.getElementById('submitButton').addEventListener('click', function() {
//   const user = auth.currentUser; // Get the currently logged-in user
//   const hoursLogged = document.getElementById('hoursLogged1').value; // Adjust based on your input field

//   if (user) {
//     const hoursRef = ref(database, 'users/' + user.uid + '/hours'); // Reference to the user's hours
//     set(hoursRef, {
//       activity1: hoursLogged // Save logged hours
//     }).then(() => {
//       console.log('Hours logged successfully!');
//       document.getElementById('hoursLogged1').value = ''; // Clear input field
//     }).catch((error) => {
//       console.error('Error logging hours: ', error);
//     });
//   } else {
//     console.log('User is not logged in');
//   }
// });