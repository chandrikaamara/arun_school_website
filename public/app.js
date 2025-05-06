// Import Firebase modules (modular style)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuyLpaOqlbHmawV7_KYGEz0OPsXFqYU2o",
  authDomain: "arun-school-website.firebaseapp.com",
  projectId: "arun-school-website",
  storageBucket: "arun-school-website.firebasestorage.app",
  messagingSenderId: "810396654550",
  appId: "1:810396654550:web:3e6159bfa7e2af18216277",
  measurementId: "G-F0ZQE2H92P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ------------------ LOGIN FUNCTION ------------------ //
function loginUser(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return getDoc(doc(db, "users", user.uid));
    })
    .then((docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const role = userData.role;

        if (role === "Organizer") {
          window.location.href = "organizer-dashboard.html";
        } else if (role === "Faculty") {
          window.location.href = "faculty-dashboard.html";
        } else if (role === "Student") {
          window.location.href = "student-dashboard.html";
        } else {
          alert("Unknown role! Contact admin.");
        }
      } else {
        throw new Error("User data not found.");
      }
    })
    .catch((error) => {
      console.error("Login Error:", error.message);
      alert(error.message);
    });
}

// ------------------ PASSWORD RESET FUNCTION ------------------ //
function resetPassword(email) {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset email sent!");
      window.location.href = "login.html"; // Redirect to login page after reset email is sent
    })
    .catch((error) => {
      console.error("Password Reset Error:", error.message);
      alert("Error: " + error.message);
    });
}

// Make functions available in HTML
window.loginUser = loginUser;
window.resetPassword = resetPassword;
