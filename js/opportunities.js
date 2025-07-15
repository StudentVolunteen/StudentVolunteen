import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';

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
    
    col.innerHTML = `
        <div class="card h-100">
            <img src="${imageSrc}" class="card-img-top" alt="${eventData.title}">
            <div class="card-body">
                <h5 class="card-title">${eventData.title}</h5>
                <p class="card-text secondary-text">${eventData.description}</p>
                <p class="card-text"><small class="text-muted">Supervisor: ${eventData.email}</small></p>
                <button class="btn btn-primary w-100" onclick="openModal('${eventData.title}', '${eventData.email}', '${eventId}')">Sign Up</button>
            </div>
        </div>
    `;
    
    return col;
}

// Make loadEvents available globally
window.loadEvents = loadEvents;

// Load events when the page loads
document.addEventListener('DOMContentLoaded', loadEvents);

  