import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA79iehQIw4xCvmoOl5_fdg-spAGGOMjb4",
  authDomain: "fir-9-learn-87e58.firebaseapp.com",
  projectId: "fir-9-learn-87e58",
  storageBucket: "fir-9-learn-87e58.appspot.com",
  messagingSenderId: "651707871440",
  appId: "1:651707871440:web:c2bc652cf90f7fe8046ed5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }