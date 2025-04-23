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

try {
    // Search the Members collection for the given email
    const membersRef = collection(db, "Members");
    const q = query(membersRef, where("Email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
            const memberRef = doc.ref;

            // Update the CheckIns array with the new check-in
            await updateDoc(memberRef, {
                CheckIns: arrayUnion({ date: new Date() })
            });

            alert("Check-in successful!");
        });
    } else {
        alert("No member found with that email.");
    }
} catch (e) {
    console.error("Error during check-in: ", e);
    alert("Error submitting check-in.");
}

// Clear the form
document.getElementById('entryForm').reset();

});
