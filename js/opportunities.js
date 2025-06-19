import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
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

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const data = {
    name: 'Los Angeles',
    state: 'CA',
    country: 'USA'
};

// Function to add data to Firestore
async function addDocument() {
    try {
        // Specify the document location in the "userInfo" collection with ID "LA"
        const res = await setDoc(doc(db, 'userInfo', 'LA'), data);
        console.log("Document written successfully", res);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}

// Listen for the click event on the button with id "Submit1"
document.getElementById("Submit1").addEventListener("click", () => {
    // Call the addDocument function
    //addDocument();
    
    // Optionally, close the popup after submission if desired
    console.log("hello");
});

  