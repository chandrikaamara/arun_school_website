import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyCuyLpaOqlbHmawV7_KYGEz0OPsXFqYU2o",
  authDomain: "arun-school-website.firebaseapp.com",
  projectId: "arun-school-website",
  storageBucket: "arun-school-website.firebasestorage.app",
  messagingSenderId: "810396654550",
  appId: "1:810396654550:web:3e6159bfa7e2af18216277",
  measurementId: "G-F0ZQE2H92P"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) return alert("User not found.");

    const studentData = userDoc.data();
    const { name, studentId, class: studentClass } = studentData;

    document.getElementById("student-name").textContent = name || "Student";
    document.getElementById("student-id").textContent = studentId || "-";
    document.getElementById("student-class").textContent = studentClass || "-";

    // Attendance
    const attendanceRef = collection(db, "attendance");
    const q = query(attendanceRef, where("studentId", "==", studentId));
    const snapshot = await getDocs(q);

    const attendanceTable = document.querySelector("#attendance-table tbody");
    snapshot.forEach((doc) => {
      const { subject, date, time, status } = doc.data();
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${date}</td><td>${time}</td><td>${subject}</td><td>${status}</td>`;
      attendanceTable.appendChild(tr);
    });

    // Marks
    const marksRef = collection(db, "marks");
    const marksQuery = query(marksRef, where("studentId", "==", studentId));
    const marksSnapshot = await getDocs(marksQuery);

    const marksTable = document.querySelector("#marks-table tbody");
    marksSnapshot.forEach((doc) => {
      const { subject, marks } = doc.data();
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${subject}</td><td>${marks}</td>`;
      marksTable.appendChild(tr);
    });

  } else {
    window.location.href = "login.html";
  }
});
