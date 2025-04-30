# arun_school_website

## **Project Overview**

This is a **School Management Website** where three types of users — **Organizer**, **Faculty**, and **Student** — can interact with the system. The project allows for **real-time attendance management**, **marks updates**, and **role-based access control**. 

The application is powered by **Firebase** for authentication, real-time database (Firestore), and hosting.

---

## **Features**

1. **User Authentication**: 
   - Users can **register** and **login** with roles (Organizer, Faculty, Student) using **Firebase Authentication**.
   - Different user roles are assigned different levels of access:
     - **Organizer**: Manages all users and oversees attendance/marks.
     - **Faculty**: Marks attendance and updates student marks.
     - **Student**: Views their attendance and marks.

2. **Attendance Management**: 
   - **Faculty** can **mark attendance** for students.
   - Attendance is updated **in real-time** and stored in **Firebase Firestore**.

3. **Marks Management**: 
   - **Faculty** can **update marks** for students.
   - Marks are stored and updated **real-time**.

4. **Real-time Updates**: 
   - Attendance and marks data are **synchronized** across all devices instantly when updated.

5. **Hosting**: 
   - The website is hosted on **Firebase Hosting**, allowing for **easy deployment** and **scalability**.

---

## **Tech Stack**

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Firebase (Authentication, Firestore, Hosting)
- **Database**: Firebase Firestore (NoSQL)
- **Hosting**: Firebase Hosting

---

## **Structure**

/school-management
│
├── /public
│   ├── index.html                # Homepage
│   ├── dashboard.html            # User-specific dashboard page
│   ├── login.html                # Login page
│   ├── register.html             # Registration page
│   ├── attendance.html           # Attendance management page
│   ├── marks.html                # Marks management page
│   ├── styles.css                # Global CSS
│   └── app.js                    # Frontend JavaScript
│
├── firebase.json                 # Firebase hosting configuration
└── .firebaserc                   # Firebase project configuration


