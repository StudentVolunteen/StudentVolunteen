import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, getDoc, addDoc, collection, setDoc, updateDoc, arrayUnion } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';

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

  //Initialize services
  const db = getFirestore()

  const create = document.getElementById('submitButton');
create.addEventListener("click", async (e) => {
    const title = document.getElementById('firstName').value;
    const description = document.getElementById('addDescription').value;
    const email = document.getElementById('supervisorMail').value;
    const password = document.getElementById('password').value;
    const eventDate = document.getElementById('eventDate')?.value || new Date().toISOString().slice(0,10);
    const eventUrl = document.getElementById('eventUrl')?.value || '';

    if (!title || !description || !email) {
        alert("Please fill in all required fields");
        return;
    }

    try {
        // Save event to Events collection
        await setDoc(doc(db, "Events", title), {
            title: title,
            description: description,
            supervisorEmail: email,
            date: eventDate,
            url: eventUrl
        });

        // Update supervisor's events list
        const supervisorRef = doc(db, "Supervisors", email);
        const supervisorDoc = await getDoc(supervisorRef);
        
        if (supervisorDoc.exists()) {
            await updateDoc(supervisorRef, {
                events: arrayUnion(title)
            });
        } else {
            // Create supervisor document if it doesn't exist
            await setDoc(supervisorRef, {
                email: email,
                events: [title]
            });
        }

        alert("Event created successfully!");
        
        // Clear form
        document.getElementById('firstName').value = '';
        document.getElementById('addDescription').value = '';
        document.getElementById('supervisorMail').value = '';
        document.getElementById('password').value = '';
        if (document.getElementById('eventDate')) document.getElementById('eventDate').value = '';
        if (document.getElementById('eventUrl')) document.getElementById('eventUrl').value = '';
        
    } catch (error) {
        console.error("Error creating event: ", error);
        alert("Failed to create event. Please try again.");
    }
}) 