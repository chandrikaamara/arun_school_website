// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  Timestamp,
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

// ---------------------- REGISTER FORM ----------------------
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return setDoc(doc(db, "users", user.uid), {
          role,
          email,
        });
      })
      .then(() => {
        alert("Registration successful!");
        window.location.href = "login.html";
      })
      .catch((error) => {
        console.error("Registration error:", error);
        alert("Registration failed: " + error.message);
      });
  });
}

// ---------------------- LOGIN FORM ----------------------
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return getDoc(doc(db, "users", user.uid));
      })
      .then((docSnap) => {
        if (docSnap.exists()) {
          const role = docSnap.data().role;
          switch (role) {
            case "Organizer":
              window.location.href = "organizer-dashboard.html";
              break;
            case "Faculty":
              window.location.href = "faculty-dashboard.html";
              break;
            case "Student":
              window.location.href = "student-dashboard.html?studentId=" + auth.currentUser.email;
              break;
            case "Others":
              window.location.href = "others-info.html";
              break;
            default:
              alert("Unknown role.");
          }
        } else {
          alert("User data not found.");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert("Login failed: " + error.message);
      });
  });
}

// ---------------------- FACULTY - ADD STUDENT ----------------------
const addStudentForm = document.getElementById("add-student-form");
if (addStudentForm) {
  addStudentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const studentId = document.getElementById("student-id").value;
    const studentName = document.getElementById("student-name").value;
    const studentClass = document.getElementById("student-class").value;
    const studentPassword = document.getElementById("student-password").value;

    createUserWithEmailAndPassword(auth, studentId, studentPassword)
      .then((userCredential) => {
        return setDoc(doc(db, "users", studentId), {
          role: "Student",
          name: studentName,
          studentId,
          class: studentClass,
          email: studentId,
        });
      })
      .then(() => {
        alert("Student added successfully.");
        addStudentForm.reset();
      })
      .catch((error) => {
        console.error("Add student error:", error);
        alert("Failed to add student: " + error.message);
      });
  });
}

// ---------------------- FACULTY - MARK ATTENDANCE ----------------------
const markAttendanceButton = document.getElementById("mark-attendance");
if (markAttendanceButton) {
  markAttendanceButton.addEventListener("click", () => {
    const selectedClass = document.getElementById("select-class").value;
    const selectedSubject = document.getElementById("select-subject").value;

    const q = query(collection(db, "users"), where("class", "==", selectedClass), where("role", "==", "Student"));
    getDocs(q)
      .then((querySnapshot) => {
        querySnapshot.forEach((docSnap) => {
          const student = docSnap.data();
          addDoc(collection(db, "attendance"), {
            studentId: student.studentId,
            class: selectedClass,
            subject: selectedSubject,
            date: Timestamp.now(),
            status: "Absent", // default status
          });
        });
        alert(`Attendance marked for ${selectedClass} - ${selectedSubject}`);
      })
      .catch((error) => {
        console.error("Attendance error:", error);
        alert("Error marking attendance.");
      });
  });
}

// ---------------------- STUDENT - VIEW ATTENDANCE ----------------------
const studentIdFromURL = new URLSearchParams(window.location.search).get("studentId");
if (studentIdFromURL) {
  const attendanceTable = document.getElementById("attendance-table");
  if (attendanceTable) {
    const q = query(collection(db, "attendance"), where("studentId", "==", studentIdFromURL));
    getDocs(q)
      .then((querySnapshot) => {
        querySnapshot.forEach((docSnap) => {
          const attendance = docSnap.data();
          const row = attendanceTable.insertRow();
          row.insertCell(0).textContent = new Date(attendance.date.seconds * 1000).toLocaleDateString();
          row.insertCell(1).textContent = attendance.subject;
          row.insertCell(2).textContent = attendance.status;
        });
      })
      .catch((error) => {
        console.error("Error loading attendance:", error);
      });
  }
}
