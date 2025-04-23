// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCbZ7xXq3ymeWRgXDjOsu-xMvEKwv33ig8",
    authDomain: "member-management-system-cb2dc.firebaseapp.com",
    projectId: "member-management-system-cb2dc",
    storageBucket: "member-management-system-cb2dc.firebasestorage.app",
    messagingSenderId: "834961798562",
    appId: "1:834961798562:web:525a5bbfc7f53000d4eefb",
    measurementId: "G-YE8ZCN42B2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Autofill date input with today's date
window.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById("date");
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
});

// Form submission handler
document.getElementById('entryForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;

    // Clear previous messages (if any)
    clearMessages();

    try {
        // Search the Members collection for the given email
        const membersRef = collection(db, "Members");
        const q = query(membersRef, where("Email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            querySnapshot.forEach(async (doc) => {
                const memberRef = doc.ref;
                const memberData = doc.data();

                // Get the last check-in time from the CheckIns array
                const lastCheckIn = memberData.CheckIns?.length > 0 ? memberData.CheckIns[memberData.CheckIns.length - 1].date.toDate() : null;

                const now = new Date();
                const twoHoursAgo = new Date(now - 2 * 60 * 60 * 1000); // 2 hours ago

                if (lastCheckIn && lastCheckIn > twoHoursAgo) {
                    // If the last check-in was within the last 2 hours
                    showErrorMessage("You can only check in once every 2 hours. Please wait before checking in again.");
                } else {
                    // Update the CheckIns array with the new check-in
                    await updateDoc(memberRef, {
                        CheckIns: arrayUnion({ date: now })
                    });

                    showSuccessMessage("Check-in successful!");
                }
            });
        } else {
            showErrorMessage("No member found with that email.");
        }
    } catch (e) {
        console.error("Error during check-in: ", e);
        showErrorMessage("Error submitting check-in.");
    }

    // Clear the form
    document.getElementById('entryForm').reset();
});

// Function to display error messages
function showErrorMessage(message) {
    const errorContainer = document.createElement('div');
    errorContainer.id = 'error-message';
    errorContainer.textContent = message;
    document.body.appendChild(errorContainer);
}

// Function to display success messages
function showSuccessMessage(message) {
    const successContainer = document.createElement('div');
    successContainer.id = 'success-message';
    successContainer.textContent = message;
    document.body.appendChild(successContainer);
}

// Function to clear previous messages
function clearMessages() {
    const existingErrorMessage = document.getElementById('error-message');
    const existingSuccessMessage = document.getElementById('success-message');
    
    if (existingErrorMessage) {
        existingErrorMessage.remove();
    }
    
    if (existingSuccessMessage) {
        existingSuccessMessage.remove();
    }
}
