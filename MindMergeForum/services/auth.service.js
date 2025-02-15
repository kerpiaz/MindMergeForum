import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/config/firebase.config";
export const registerUser = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const loginUser = (email, password) => signInWithEmailAndPassword(auth, email, password);
