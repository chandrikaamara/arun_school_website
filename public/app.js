// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  addDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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

// Expose loginUser function globally
window.loginUser = loginUser;

// ------------------ BUTTON CLICK EVENTS ------------------ //
document.getElementById("add-student-btn").addEventListener("click", () => {
  toggleVisibility("add-student-form");
});

document.getElementById("mark-attendance-btn").addEventListener("click", () => {
  toggleVisibility("mark-attendance-form");
});

document.getElementById("view-attendance-btn").addEventListener("click", () => {
  toggleVisibility("view-attendance-form");
  fetchAttendance();  // Fetch attendance data when view attendance is clicked
});

document.getElementById("add-marks-btn").addEventListener("click", () => {
  toggleVisibility("add-marks-form");
});

document.getElementById("view-marks-btn").addEventListener("click", () => {
  toggleVisibility("view-marks-form");
  fetchMarks();  // Fetch marks data when view marks is clicked
});

// ------------------ TOGGLE VISIBILITY FUNCTION ------------------ //
function toggleVisibility(formId) {
  const forms = document.querySelectorAll(".form-container");
  forms.forEach((form) => {
    if (form.id === formId) {
      form.style.display = form.style.display === "none" ? "block" : "none";
    } else {
      form.style.display = "none";
    }
  });
}

// ------------------ ADD STUDENT FUNCTION ------------------ //
document.getElementById("add-student-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const studentName = document.getElementById("student-name").value;
  const studentRoll = document.getElementById("student-roll").value;
  const studentClass = document.getElementById("student-class").value;
  const studentPassword = document.getElementById("student-password").value;

  db.collection("students").add({
    name: studentName,
    roll: studentRoll,
    class: studentClass,
    password: studentPassword,
  }).then(() => {
    document.getElementById("add-student-message").textContent = "Student added successfully!";
    document.getElementById("add-student-form").reset();
  }).catch((error) => {
    document.getElementById("add-student-message").textContent = "Error adding student: " + error.message;
  });
});

// ------------------ MARK ATTENDANCE FUNCTION ------------------ //
document.getElementById("mark-attendance-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const attendanceClass = document.getElementById("attendance-class").value;
  const attendanceSubject = document.getElementById("attendance-subject").value;
  const attendanceDate = document.getElementById("attendance-date").value;

  db.collection("attendance").add({
    class: attendanceClass,
    subject: attendanceSubject,
    date: attendanceDate,
    status: "present",  // Modify this logic based on actual student attendance marking
  }).then(() => {
    document.getElementById("mark-attendance-message").textContent = "Attendance marked successfully!";
    document.getElementById("mark-attendance-form").reset();
  }).catch((error) => {
    document.getElementById("mark-attendance-message").textContent = "Error marking attendance: " + error.message;
  });
});

// ------------------ FETCH ATTENDANCE FUNCTION ------------------ //
function fetchAttendance() {
  db.collection("attendance").get().then((snapshot) => {
    const attendanceData = snapshot.docs.map(doc => doc.data());
    const attendanceList = document.getElementById("attendance-list");
    attendanceList.innerHTML = "";
    attendanceData.forEach(attendance => {
      attendanceList.innerHTML += `
        <p>Class: ${attendance.class}, Subject: ${attendance.subject}, Date: ${attendance.date}, Status: ${attendance.status}</p>
      `;
    });
  }).catch((error) => {
    console.log("Error fetching attendance:", error);
  });
}

// ------------------ FETCH MARKS FUNCTION ------------------ //
function fetchMarks() {
  db.collection("marks").get().then((snapshot) => {
    const marksData = snapshot.docs.map(doc => doc.data());
    const marksList = document.getElementById("marks-list");
    marksList.innerHTML = "";
    marksData.forEach(mark => {
      marksList.innerHTML += `
        <p>Class: ${mark.class}, Subject: ${mark.subject}, Marks: ${mark.marks}</p>
      `;
    });
  }).catch((error) => {
    console.log("Error fetching marks:", error);
  });
}
