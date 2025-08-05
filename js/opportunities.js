import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';

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

// Global variables for sorting
let allEvents = [];
let userLocation = null;

// Function to fetch and display events
async function loadEvents() {
    try {
        const querySnapshot = await getDocs(collection(db, "Events"));
        const opportunitiesList = document.getElementById('opportunities-list');
        
        // Clear existing content
        opportunitiesList.innerHTML = '';
        
        // Store all events for sorting
        allEvents = [];
        querySnapshot.forEach((doc) => {
            const eventData = doc.data();
            allEvents.push({ ...eventData, id: doc.id });
        });
        
        console.log('Loaded events:', allEvents);
        
        // Display events
        displayEvents(allEvents);
        
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

// Function to display events
function displayEvents(events) {
    console.log('Displaying events:', events);
    const opportunitiesList = document.getElementById('opportunities-list');
    
    if (!opportunitiesList) {
        console.error('Opportunities list element not found!');
        return;
    }
    
    opportunitiesList.innerHTML = '';
    
    if (!events || events.length === 0) {
        opportunitiesList.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">No events to display.</p>
            </div>
        `;
        return;
    }
    
    events.forEach((eventData) => {
        const eventCard = createEventCard(eventData, eventData.id);
        opportunitiesList.appendChild(eventCard);
    });
    
    console.log('Events displayed successfully');
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
    
    // Check if user is admin (volunteen.company@gmail.com)
    const isAdmin = currentUserEmail === 'volunteen.company@gmail.com';
    
    // Debug logging
    console.log('User permissions check:', {
        loggedIn,
        currentUserEmail,
        role,
        permissions,
        hasSubAdminPermission,
        isAdmin
    });
    
    // Check if user is the creator of this event (for supervisors)
    const isEventCreator = eventData.email === currentUserEmail;
    
    // Check if user has signed up for this event (for students)
    const userHours = JSON.parse(localStorage.getItem('volunteen_hours') || '[]');
    const currentUser = localStorage.getItem('volunteen_current_user') || 'demo';
    const hasSignedUp = userHours.some(hour => 
        hour.event === eventData.title && 
        (hour.student_email === currentUser || (currentUser === 'demo' && !hour.student_email))
    );
    
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
                        `<button class="btn btn-sm btn-outline-primary" onclick="editEvent('${eventId}', '${eventData.title}')" title="Edit Event">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteEvent('${eventId}', '${eventData.title}')" title="Delete Event">
                            <i class="fa fa-trash"></i>
                        </button>` : ''
                    }
                    ${loggedIn && isAdmin ? 
                        `<button class="btn btn-sm btn-outline-danger" onclick="adminDeleteEvent('${eventId}', '${eventData.title}')" title="Admin Delete Event">
                            <i class="fa fa-trash"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-warning" onclick="undoDeleteEvent('${eventId}', '${eventData.title}')" title="Undo Delete" style="display: none;" id="undo-${eventId}">
                            <i class="fa fa-undo"></i>
                        </button>` : ''
                    }
                    ${loggedIn && !hasSubAdminPermission && !isAdmin && hasSignedUp ? 
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
                <p class="card-text"><small class="text-muted">Address: ${eventData.eventAddress || 'TBD'}</small></p>
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
    
    // Debug: Log admin status for this card
    if (isAdmin) {
        console.log(`Admin buttons should be visible for event: ${eventData.title}`);
    }
    
    return col;
}

// Function to edit an event (for supervisors)
function editEvent(eventId, eventTitle) {
    // Store the event ID and title for editing
    localStorage.setItem('editing_event_id', eventId);
    localStorage.setItem('editing_event_title', eventTitle);
    
    // Redirect to the add opportunities page in edit mode
    window.location.href = 'addopps.admin.html?mode=edit';
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

// Function to delete an event (for admin - with undo capability)
async function adminDeleteEvent(eventId, eventTitle) {
    if (confirm(`Are you sure you want to delete the event "${eventTitle}"? You can undo this action.`)) {
        try {
            // Store the event data before deletion for potential undo
            const eventRef = doc(db, "Events", eventId);
            const eventDoc = await getDoc(eventRef);
            const eventData = eventDoc.data();
            
            // Store in localStorage for undo
            const deletedEvents = JSON.parse(localStorage.getItem('deleted_events') || '[]');
            deletedEvents.push({
                id: eventId,
                title: eventTitle,
                data: eventData,
                deletedAt: new Date().toISOString()
            });
            localStorage.setItem('deleted_events', JSON.stringify(deletedEvents));
            
            // Delete the event
            await deleteDoc(eventRef);
            alert("Event deleted successfully! You can undo this action.");
            
            // Show undo button
            const undoBtn = document.getElementById(`undo-${eventId}`);
            if (undoBtn) {
                undoBtn.style.display = 'inline-block';
            }
            
            loadEvents(); // Refresh the events list
        } catch (error) {
            console.error("Error deleting event: ", error);
            alert("Failed to delete event: " + error.message);
        }
    }
}

// Function to undo delete (for admin)
async function undoDeleteEvent(eventId, eventTitle) {
    try {
        // Get the deleted event data
        const deletedEvents = JSON.parse(localStorage.getItem('deleted_events') || '[]');
        const deletedEvent = deletedEvents.find(event => event.id === eventId);
        
        if (!deletedEvent) {
            alert("No deleted event found to restore.");
            return;
        }
        
        // Restore the event
        const eventRef = doc(db, "Events", eventId);
        await setDoc(eventRef, deletedEvent.data);
        
        // Remove from deleted events list
        const updatedDeletedEvents = deletedEvents.filter(event => event.id !== eventId);
        localStorage.setItem('deleted_events', JSON.stringify(updatedDeletedEvents));
        
        alert("Event restored successfully!");
        
        // Hide undo button
        const undoBtn = document.getElementById(`undo-${eventId}`);
        if (undoBtn) {
            undoBtn.style.display = 'none';
        }
        
        loadEvents(); // Refresh the events list
    } catch (error) {
        console.error("Error restoring event: ", error);
        alert("Failed to restore event: " + error.message);
    }
}

// Function to cancel signup (for students)
function cancelSignup(eventTitle) {
    if (confirm(`Are you sure you want to cancel your signup for "${eventTitle}"?`)) {
        try {
            let hours = JSON.parse(localStorage.getItem('volunteen_hours') || '[]');
            const currentUser = localStorage.getItem('volunteen_current_user') || 'demo';
            
            // Remove only the current user's signup for this event
            hours = hours.filter(hour => 
                !(hour.event === eventTitle && 
                  (hour.student_email === currentUser || (currentUser === 'demo' && !hour.student_email)))
            );
            
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

// Function to sort events by date
function sortByDate() {
    console.log('Sorting by date...');
    console.log('All events:', allEvents);
    
    if (!allEvents || allEvents.length === 0) {
        console.log('No events to sort');
        return;
    }
    
    const sortedEvents = [...allEvents].sort((a, b) => {
        const dateA = a.eventDate ? new Date(a.eventDate) : new Date('9999-12-31');
        const dateB = b.eventDate ? new Date(b.eventDate) : new Date('9999-12-31');
        
        // Handle invalid dates
        if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;
        
        return dateA - dateB; // Closest to current date first
    });
    
    console.log('Sorted events:', sortedEvents);
    displayEvents(sortedEvents);
}

// Function to sort events by location
async function sortByLocation() {
    console.log('Sorting by location...');
    console.log('All events:', allEvents);
    
    if (!allEvents || allEvents.length === 0) {
        console.log('No events to sort');
        return;
    }
    
    if (!userLocation) {
        // Request user location
        if (navigator.geolocation) {
            try {
                console.log('Requesting location...');
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 60000
                    });
                });
                
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                console.log('Location obtained:', userLocation);
                // Now sort by distance
                sortEventsByDistance(allEvents);
            } catch (error) {
                console.error('Geolocation error:', error);
                alert('Location access denied or unavailable. Please enable location services to sort by distance.');
                // Fallback to alphabetical sort
                sortEventsByDistance(allEvents);
            }
        } else {
            alert('Geolocation is not supported by this browser.');
            // Fallback to alphabetical sort
            sortEventsByDistance(allEvents);
        }
    } else {
        // Use cached location
        console.log('Using cached location:', userLocation);
        sortEventsByDistance(allEvents);
    }
}

// Function to sort events by distance from user
function sortEventsByDistance(events) {
    console.log('Sorting events by distance...');
    
    // For now, we'll do a simple alphabetical sort by address
    // In a real implementation, you'd use a geocoding service to get coordinates
    // and calculate actual distances
    const sortedEvents = [...events].sort((a, b) => {
        const addressA = (a.eventAddress || 'TBD').toLowerCase();
        const addressB = (b.eventAddress || 'TBD').toLowerCase();
        
        // Put events without addresses at the end
        if (addressA === 'tbd' && addressB !== 'tbd') return 1;
        if (addressA !== 'tbd' && addressB === 'tbd') return -1;
        if (addressA === 'tbd' && addressB === 'tbd') return 0;
        
        return addressA.localeCompare(addressB);
    });
    
    console.log('Sorted events by location:', sortedEvents);
    displayEvents(sortedEvents);
}

// Make functions available globally
window.loadEvents = loadEvents;
window.editEvent = editEvent;
window.deleteEvent = deleteEvent;
window.adminDeleteEvent = adminDeleteEvent;
window.undoDeleteEvent = undoDeleteEvent;
window.cancelSignup = cancelSignup;
window.cleanupAllEvents = cleanupAllEvents;
window.sortByDate = sortByDate;
window.sortByLocation = sortByLocation;

// Load events when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Debug: Check if admin is logged in
    const currentUser = localStorage.getItem('volunteen_current_user');
    const isLoggedIn = localStorage.getItem('volunteen_logged_in') === 'true';
    console.log('Page loaded - Current user:', currentUser);
    console.log('Is logged in:', isLoggedIn);
    console.log('Is admin:', currentUser === 'volunteen.company@gmail.com');
    
    loadEvents();
});

  