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
    
    // Check if this is the admin account
    if (email === 'volunteen.company@gmail.com') {
      localStorage.setItem('volunteen_logged_in', 'true');
      localStorage.setItem('volunteen_current_user', email);
      localStorage.setItem('volunteen_current_role', 'admin');
      localStorage.setItem('volunteen_current_permissions', JSON.stringify(['admin']));
      console.log('Admin account logged in:', email);
    } else {
      // SIMPLE, RELIABLE ROLE CHECK
      // Check if user is marked as supervisor in any storage location
      const emailBasedRole = localStorage.getItem('volunteen_user_role_' + email);
      const uidBasedRole = localStorage.getItem('volunteen_user_' + userCredential.user.uid + '_role');
      const usersObject = JSON.parse(localStorage.getItem('volunteen_users') || '{}');
      const userInUsers = usersObject[email];
      
      // Determine role - if ANY storage says supervisor, they're a supervisor
      let finalRole = 'student';
      if (emailBasedRole === 'supervisor' || uidBasedRole === 'supervisor' || 
          (userInUsers && userInUsers.role === 'supervisor')) {
        finalRole = 'supervisor';
      }
      
      const permissions = finalRole === 'supervisor' ? ['sub-admin', 'supervisor'] : ['student'];
      
      // Set login state
      localStorage.setItem('volunteen_logged_in', 'true');
      localStorage.setItem('volunteen_current_user', email);
      localStorage.setItem('volunteen_current_role', finalRole);
      localStorage.setItem('volunteen_current_permissions', JSON.stringify(permissions));
      
      // Also update all storage locations to be consistent
      localStorage.setItem('volunteen_user_role_' + email, finalRole);
      localStorage.setItem('volunteen_user_' + userCredential.user.uid + '_role', finalRole);
      
      console.log('User logged in:', email, 'with role:', finalRole, 'UID:', userCredential.user.uid);
      console.log('Role sources:', { emailBasedRole, uidBasedRole, userInUsers: userInUsers?.role });
    }
    
    // Redirect based on user role
    const role = localStorage.getItem('volunteen_current_role');
    if (role === 'supervisor') {
      window.location.href = "addopps.admin.html";
    } else {
      window.location.href = "index.login.html";
    }
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
      }
    ).catch(function(error) {
      var error_message = error.message
      alert(error_message)
    })
  }*/