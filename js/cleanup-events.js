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

// Function to cleanup events
async function cleanupEvents() {
    try {
        console.log("Starting event cleanup...");
        const querySnapshot = await getDocs(collection(db, "Events"));
        let deletedCount = 0;
        let keptCount = 0;
        
        for (const docSnapshot of querySnapshot.docs) {
            const eventData = docSnapshot.data();
            const eventTitle = eventData.title;
            
            // Keep only the "PB and J for Homeless" event
            if (eventTitle.toLowerCase().includes('pb and j') || 
                eventTitle.toLowerCase().includes('pb&j') ||
                eventTitle.toLowerCase().includes('peanut butter')) {
                console.log(`Keeping event: ${eventTitle}`);
                keptCount++;
            } else {
                console.log(`Deleting event: ${eventTitle}`);
                await deleteDoc(doc(db, "Events", docSnapshot.id));
                deletedCount++;
            }
        }
        
        console.log(`Cleanup complete! Deleted ${deletedCount} events, kept ${keptCount} events.`);
        alert(`Cleanup complete!\nDeleted: ${deletedCount} events\nKept: ${keptCount} events`);
        
    } catch (error) {
        console.error("Error during cleanup: ", error);
        alert("Error during cleanup: " + error.message);
    }
}

// Make function available globally
window.cleanupEvents = cleanupEvents;

// Auto-run cleanup when script loads
document.addEventListener('DOMContentLoaded', () => {
    if (confirm("This will delete all events except 'PB and J for Homeless'. Continue?")) {
        cleanupEvents();
    }
}); 