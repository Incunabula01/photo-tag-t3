import { initializeApp } from "@firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "@firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Todo: Add Env Variables
// const firebaseConfig = {
//   projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
// };

const firebaseConfig = {
  apiKey: "AIzaSyDhqwsL8CsMqAiV7jlnlf-Hh1L5q-SbZyA",
  authDomain: "photo-tag-storage.firebaseapp.com",
  projectId: "photo-tag-storage",
  storageBucket: "photo-tag-storage.appspot.com",
  messagingSenderId: "463963801505",
  appId: "1:463963801505:web:1c0ce79fad6e4d07756de0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, storage, ref, uploadBytes, getDownloadURL };
