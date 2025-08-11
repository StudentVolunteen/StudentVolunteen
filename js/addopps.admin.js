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
const hasSubAdminPermission = permissions.includes('sub-admin') || role === 'supervisor' || permissions.includes('supervisor');

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

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, looking for submit button...');
    const create = document.getElementById('submitButton');
    console.log('Submit button found:', create);
    
    if (create) {
        console.log('Adding click event listener to submit button');
        create.addEventListener("click", async (e) => {
            console.log('Submit button clicked!');
    e.preventDefault();

    const title = document.getElementById('firstName').value;
    const description = document.getElementById('addDescription').value;
    const email = document.getElementById('supervisorMail').value;
    const eventDate = document.getElementById('eventDate').value;
    const volunteerCount = document.getElementById('volunteerCount').value;
    const eventAddress = document.getElementById('eventAddress').value;
    const password = document.getElementById('password').value;
    const eventPin = document.getElementById('eventPin').value;

    // Debug: Log the values to see what's missing
    console.log('Form values:', {
        title: title,
        description: description,
        email: email,
        eventDate: eventDate,
        volunteerCount: volunteerCount,
        eventAddress: eventAddress,
        password: password,
        eventPin: eventPin
    });
    
    if (!title || !description || !email || !eventDate || !volunteerCount || !eventAddress) {
        alert("Please fill in all required fields!");
        console.log('Missing fields:', {
            title: !title,
            description: !description,
            email: !email,
            eventDate: !eventDate,
            volunteerCount: !volunteerCount,
            eventAddress: !eventAddress
        });
        return;
    }

    // Debug permissions
    console.log('Permission check in addopps:', {
        role: role,
        permissions: permissions,
        hasSubAdminPermission: hasSubAdminPermission,
        breakdown: {
            hasSubAdmin: permissions.includes('sub-admin'),
            isSupervisorRole: role === 'supervisor',
            hasSupervisorPermission: permissions.includes('supervisor')
        }
    });
    
    // Check permissions for creating/editing events
    const loggedIn = localStorage.getItem('volunteen_logged_in') === 'true';
    const currentUserEmail = localStorage.getItem('volunteen_current_user');
    const role = localStorage.getItem('volunteen_current_role');
    const permissions = JSON.parse(localStorage.getItem('volunteen_current_permissions') || '[]');
    
    // Check if user has sub-admin permissions (supervisor)
    const hasSubAdminPermission = permissions.includes('sub-admin') || role === 'supervisor';
    
    // For editing, check if user is the creator of the event
    let canEdit = false;
    if (isEditMode && editingEventId) {
        // Get the event data to check if current user is the creator
        try {
            const eventDoc = await getDoc(doc(db, "Events", editingEventId));
            if (eventDoc.exists()) {
                const eventData = eventDoc.data();
                const eventEmail = (eventData.email || '').trim().toLowerCase();
                const userEmail = (currentUserEmail || '').trim().toLowerCase();
                canEdit = eventEmail === userEmail;
            }
        } catch (error) {
            console.error("Error checking event permissions:", error);
        }
    }
    
    if (loggedIn && (hasSubAdminPermission || canEdit)) {
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
    } else if (!loggedIn) {
        alert("Please log in to create or edit events!");
    } else if (!hasSubAdminPermission && !canEdit) {
        if (isEditMode) {
            alert("Access denied. You can only edit events that you created.");
        } else {
            alert("Access denied. Sub-admin permissions required to create events.");
        }
    }
        });
    } else {
        console.error('Submit button not found');
    }
});