import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';

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

// Function to fetch and display events
async function loadEvents() {
    try {
        const querySnapshot = await getDocs(collection(db, "Events"));
        const opportunitiesList = document.getElementById('opportunities-list');
        
        // Clear existing content
        opportunitiesList.innerHTML = '';
        
        // Add each event to the page
        querySnapshot.forEach((doc) => {
            const eventData = doc.data();
            const eventCard = createEventCard(eventData, doc.id);
            opportunitiesList.appendChild(eventCard);
        });
        
        // If no events found, show a message
        if (querySnapshot.empty) {
            opportunitiesList.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">No volunteer opportunities available at the moment.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error loading events: ", error);
        document.getElementById('opportunities-list').innerHTML = `
            <div class="col-12 text-center">
                <p class="text-danger">Error loading opportunities. Please try again later.</p>
            </div>
        `;
    }
}

// Function to create an event card
function createEventCard(eventData, eventId) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';
    
    // Use a default image or cycle through available images
    const imageIndex = Math.floor(Math.random() * 3) + 1;
    const imageSrc = `images/s${imageIndex}.png`;
    
    // Check user permissions
    const loggedIn = localStorage.getItem('volunteen_logged_in') === 'true';
    const currentUserEmail = localStorage.getItem('volunteen_current_user') || '';
    const role = localStorage.getItem('volunteen_current_role');
    const permissions = JSON.parse(localStorage.getItem('volunteen_current_permissions') || '[]');
    const hasSubAdminPermission = permissions.includes('sub-admin') || role === 'supervisor';
    
    // Check if user is the creator of this event (for supervisors)
    const isEventCreator = eventData.email === currentUserEmail;
    
    // Check if user has signed up for this event (for students)
    const userHours = JSON.parse(localStorage.getItem('volunteen_hours') || '[]');
    const hasSignedUp = userHours.some(hour => hour.event === eventData.title);
    
    // Check if event is full
    const currentVolunteers = eventData.currentVolunteers || 0;
    const maxVolunteers = eventData.volunteerCount || 999;
    const isEventFull = currentVolunteers >= maxVolunteers;
    
    col.innerHTML = `
        <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">${eventData.title}</h5>
                <div class="btn-group">
                    ${loggedIn && hasSubAdminPermission && isEventCreator ? 
                        `<button class="btn btn-sm btn-outline-danger" onclick="deleteEvent('${eventId}', '${eventData.title}')" title="Delete Event">
                            <i class="fa fa-trash"></i>
                        </button>` : ''
                    }
                    ${loggedIn && !hasSubAdminPermission && hasSignedUp ? 
                        `<button class="btn btn-sm btn-outline-danger" onclick="cancelSignup('${eventData.title}')" title="Cancel Signup">
                            <i class="fa fa-trash"></i>
                        </button>` : ''
                    }
                </div>
            </div>
            <img src="${imageSrc}" class="card-img-top" alt="${eventData.title}">
            <div class="card-body">
                <p class="card-text secondary-text">${eventData.description}</p>
                <p class="card-text"><small class="text-muted">Supervisor: ${eventData.email}</small></p>
                <p class="card-text"><small class="text-muted">Date: ${eventData.eventDate || 'TBD'}</small></p>
                <p class="card-text"><small class="text-muted">Volunteers: ${currentVolunteers}/${maxVolunteers}</small></p>
                ${!hasSignedUp ? 
                    (isEventFull ? 
                        `<button class="btn btn-secondary w-100" disabled>Event Full</button>` :
                        `<button class="btn btn-primary w-100" onclick="openModal('${eventData.title}', '${eventData.email}', '${eventId}')">Sign Up</button>`
                    ) :
                    `<button class="btn btn-success w-100" disabled>Already Signed Up</button>`
                }
            </div>
        </div>
    `;
    
    return col;
}

// Function to delete an event (for supervisors)
async function deleteEvent(eventId, eventTitle) {
    if (confirm(`Are you sure you want to delete the event "${eventTitle}"? This action cannot be undone.`)) {
        try {
            await deleteDoc(doc(db, "Events", eventId));
            alert("Event deleted successfully!");
            loadEvents(); // Refresh the events list
        } catch (error) {
            console.error("Error deleting event: ", error);
            alert("Failed to delete event: " + error.message);
        }
    }
}

// Function to cancel signup (for students)
function cancelSignup(eventTitle) {
    if (confirm(`Are you sure you want to cancel your signup for "${eventTitle}"?`)) {
        try {
            let hours = JSON.parse(localStorage.getItem('volunteen_hours') || '[]');
            hours = hours.filter(hour => hour.event !== eventTitle);
            localStorage.setItem('volunteen_hours', JSON.stringify(hours));
            alert("Signup cancelled successfully!");
            loadEvents(); // Refresh the events list
        } catch (error) {
            console.error("Error cancelling signup: ", error);
            alert("Failed to cancel signup: " + error.message);
        }
    }
}

// Function to cleanup all events except PB and J
async function cleanupAllEvents() {
    if (confirm("This will delete ALL events except 'PB and J for Homeless'. Are you sure?")) {
        try {
            console.log("Starting cleanup...");
            const querySnapshot = await getDocs(collection(db, "Events"));
            let deletedCount = 0;
            let keptCount = 0;
            
            for (const docSnapshot of querySnapshot.docs) {
                const eventData = docSnapshot.data();
                const eventTitle = eventData.title || eventData.firstName || 'Untitled Event';
                
                // Check if title exists and is a string before calling toLowerCase()
                if (typeof eventTitle === 'string' && eventTitle.toLowerCase().includes('pb and j') || 
                    typeof eventTitle === 'string' && eventTitle.toLowerCase().includes('pb&j') ||
                    typeof eventTitle === 'string' && eventTitle.toLowerCase().includes('peanut butter')) {
                    console.log(`Keeping: ${eventTitle}`);
                    keptCount++;
                } else {
                    console.log(`Deleting: ${eventTitle}`);
                    await deleteDoc(doc(db, "Events", docSnapshot.id));
                    deletedCount++;
                }
            }
            
            alert(`Cleanup complete!\nDeleted: ${deletedCount} events\nKept: ${keptCount} events`);
            loadEvents(); // Refresh the page
            
        } catch (error) {
            console.error("Cleanup error:", error);
            alert("Error: " + error.message);
        }
    }
}

// Make functions available globally
window.loadEvents = loadEvents;
window.deleteEvent = deleteEvent;
window.cancelSignup = cancelSignup;
window.cleanupAllEvents = cleanupAllEvents;

// Load events when the page loads
document.addEventListener('DOMContentLoaded', loadEvents);

  