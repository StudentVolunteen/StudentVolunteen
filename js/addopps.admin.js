import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, getDoc, addDoc, collection, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';
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

// Check if we're in edit mode
const urlParams = new URLSearchParams(window.location.search);
const isEditMode = urlParams.get('mode') === 'edit';
const editingEventId = localStorage.getItem('editing_event_id');

// Load event data if in edit mode
if (isEditMode && editingEventId) {
    try {
        const eventDoc = await getDoc(doc(db, "Events", editingEventId));
        if (eventDoc.exists()) {
            const eventData = eventDoc.data();
            document.getElementById('firstName').value = eventData.title || '';
            document.getElementById('addDescription').value = eventData.description || '';
            document.getElementById('supervisorMail').value = eventData.email || '';
            document.getElementById('eventDate').value = eventData.eventDate || '';
            document.getElementById('volunteerCount').value = eventData.volunteerCount || '';
            document.getElementById('eventAddress').value = eventData.eventAddress || '';
            document.getElementById('password').value = eventData.password || '';
            document.getElementById('eventPin').value = eventData.eventPin || '';
            
            // Change button text and title
            document.getElementById('submitButton').textContent = 'Update Event';
            document.getElementById('form-title').textContent = 'Edit Activity';
        }
    } catch (error) {
        console.error("Error loading event data:", error);
        alert("Error loading event data. Please try again.");
    }
}

const create = document.getElementById('submitButton');
create.addEventListener("click", async (e) => {
    e.preventDefault();

    const title = document.getElementById('firstName').value;
    const description = document.getElementById('addDescription').value;
    const email = document.getElementById('supervisorMail').value;
    const eventDate = document.getElementById('eventDate').value;
    const volunteerCount = document.getElementById('volunteerCount').value;
    const eventAddress = document.getElementById('eventAddress').value;
    const password = document.getElementById('password').value;
    const eventPin = document.getElementById('eventPin').value;

    if (!title || !description || !email || !eventDate || !volunteerCount || !eventAddress) {
        alert("Please fill in all required fields!");
        return;
    }

    if (hasSubAdminPermission) {
        try {
            if (isEditMode && editingEventId) {
                // Update existing event
                await updateDoc(doc(db, "Events", editingEventId), {
                    title,
                    description,
                    email,
                    eventDate,
                    volunteerCount: parseInt(volunteerCount),
                    eventAddress,
                    password,
                    eventPin,
                    updatedAt: new Date().toISOString()
                });
                alert("Event updated successfully!");
                // Clear edit mode data
                localStorage.removeItem('editing_event_id');
                localStorage.removeItem('editing_event_title');
            } else {
                // Create new event
                await addDoc(collection(db, "Events"), {
                    title,
                    description,
                    email,
                    eventDate,
                    volunteerCount: parseInt(volunteerCount),
                    eventAddress,
                    currentVolunteers: 0,
                    password,
                    eventPin,
                    createdAt: new Date().toISOString()
                });
                alert("Event created successfully!");
            }
            // Redirect to opportunities page to see the event
            window.location.href = 'opportunities.login.html';
        } catch (err) {
            console.error("Error writing document: ", err);
            alert("Failed to " + (isEditMode ? "update" : "create") + " event: " + err.message);
        }
    } else {
        alert("You have to be a sub-admin to make an event!");
    }
});