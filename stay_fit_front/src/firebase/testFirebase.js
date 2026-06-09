import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const testFirebase = async () => {
  try {
    console.log("Testing Firebase Connection...");
    const querySnapshot = await getDocs(collection(db, "users"));
    
    if (querySnapshot.empty) {
      console.log("Firebase Connected: Users collection is empty.");
      return;
    }

    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    console.log("Firebase Connected! Successfully fetched users:", users);
  } catch (error) {
    console.error("Firebase Connection Error:", error);
  }
};
