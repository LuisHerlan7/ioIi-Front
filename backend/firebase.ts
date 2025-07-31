import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCBl_khrnq9hQaKj5V6aUnSe7PYkwUooHo",
  authDomain: "notstonks-a024b.firebaseapp.com",
  projectId: "notstonks-a024b",
  storageBucket: "notstonks-a024b.firebasestorage.app",
  messagingSenderId: "816135676099",
  appId: "1:816135676099:web:6900ba4b03c4ac13f80276",
  measurementId: "G-6XH35GW875"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Si necesitas autenticación, puedes importar y usar getAuth

export { db, auth, app }; // exportas la base de datos y la autenticación
 // exportas la base de datos y la autenticación
