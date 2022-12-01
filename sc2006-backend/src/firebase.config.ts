// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWtPb1Pq8rNtMpD2t8HsiYosC654eqm34",
  authDomain: "sc2006-final.firebaseapp.com",
  projectId: "sc2006-final",
  storageBucket: "sc2006-final.appspot.com",
  messagingSenderId: "515532668274",
  appId: "1:515532668274:web:92906c4129f2f7e88331eb",
  measurementId: 'G-WL31NG5QE4',
};

initializeApp(firebaseConfig);
// Commented out as analytics can only run on frontend
// const analytics = getAnalytics(app);
const db = getFirestore();

export { db };
