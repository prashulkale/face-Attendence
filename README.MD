# Face Attendance App

## 1. Overview

This web-based application enables users to register and mark attendance using face recognition, combined with Aadhaar number.  It supports online synchronizing captured attendance records when connectivity is restored.

**Key Objectives:**

* **Face-Based Authentication:** Capture and match live webcam feed against registered face descriptors.
* **Aadhaar Integration (Dummy):** Collect 12-digit Aadhaar number during registration (without OTP).
* **Offline Support:** Mark attendance offline and sync automatically when online.
* **Interactive UI:** Modern, responsive interface written in next.js for both registration and attendance.

## 2. Features

1. **User Registration**

   * Capture user’s name, Aadhaar number, and face descriptor.
   * Live camera preview, snapshot, and face detection.
   * Storage of face descriptor vector and Aadhaar number in MongoDB. 

2. **Attendance Marking**

   * Live camera capture to detect and recognize face.
   * Match against existing descriptors using `face-api.js`.
   * Store attendance record (`userId`, `timestamp`) online or offline.

3. **Data Listing**

   * Display table of registered users (name, Aadhaar, user ID).
   * Display chronological attendance records (user name, timestamp).


## 3. Tech Stack

* **Frontend**

  * **NEXT.JS **  for UI.
  * **face-api.js** for client-side face detection & recognition.
  * **Service Worker & Background Sync** for offline support.
  * **HTML/CSS** for layout and styling.

* **Backend**

  * **Node.js & Express** for REST API endpoints.
  * **MongoDB** (Atlas) with **Mongoose**  for data persistence.
  * **CORS & body-parser** middleware for JSON handling.

* **Hosting**

  * Backend and Frontend Both are deployed on Vercel

## 4. Architecture & Flow

1. **Registration Flow**

   * User navigates to `/register`.
   * page loads `face-api.js` models from CDN.
   * User clicks “Capture Face” to generate a descriptor.
   * On form submit, name + Aadhaar + descriptor POST to `/api/users/register`.
   * Backend stores in `users` collection.

2. **Attendance Flow**

   * User opens `/` (attendance page).
   * page fetches `/api/users` and `/api/attendance`, renders tables.
   * User clicks “Capture ”.
   * Face descriptor extracted and matched via `FaceMatcher`.
   * If recognized, attendance record POST to `/api/attendance` (or stored locally if offline).
   * Table of attendance refreshes.

<!-- 3. **Offline Sync**

   * Service Worker registers `sw.js`.
   * On offline mark, record pushed into `localStorage.pending` and Background Sync registered.
   * When back online, SW triggers sync event, posts `pending` records to `/api/attendance/bulk` and clears queue. -->


## 5. Setup & Run Instructions

1. **Clone & Install**

   ```bash
   git clone  https://github.com/prashulkale/face-Attendence.git


   

   ```

2. **Configure MongoDB**

   * Update connection string  (uses Atlas).

3. **Start the frontend**

   ```bash
   npm i
   # and
   npm run start
   ```
4. **Start the Backend**

   ```bash
   npm i
   # and
   npm run start
   ```

*End of documentation*
