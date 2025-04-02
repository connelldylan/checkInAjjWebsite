// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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

// Form submission handler
document.getElementById('entryForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;

    try {
        const docRef = await addDoc(collection(db, "entries"), {
            name: name,
            date: date,
            timestamp: new Date()
        });
        console.log("Document written with ID: ", docRef.id);
        alert("Data submitted successfully!");
    } catch (e) {
        console.error("Error adding document: ", e);
        alert("Error submitting data.");
    }

    // Clear the form
    document.getElementById('entryForm').reset();
});