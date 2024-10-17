import { initializeApp } from 'firebase/app';
import { getAuth, inMemoryPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAjklA4Hdt4nv5IU45AdrPdnDzoUMeE-Mo",
  authDomain: "employee-app-node-react.firebaseapp.com",
  projectId: "employee-app-node-react",
  storageBucket: "employee-app-node-react.appspot.com",
  messagingSenderId: "380607297662",
  appId: "1:380607297662:web:f5d77f4bb3c9c85604402f",
  measurementId: "G-0WM8NQKEDB"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
//setPersistence(inMemoryPersistence)
export { auth, db };
