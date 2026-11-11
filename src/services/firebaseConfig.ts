import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCXdbV85SKdMmIal3nTPTzOMm879z1d6nc",
  authDomain: "quarteto-chopastico.firebaseapp.com",
  databaseURL: "https://quarteto-chopastico-default-rtdb.firebaseio.com",
  projectId: "quarteto-chopastico",
  storageBucket: "quarteto-chopastico.firebasestorage.app",
  messagingSenderId: "1071240821251",
  appId: "1:1071240821251:web:b08c844a6bfc6a91a1ec36"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);