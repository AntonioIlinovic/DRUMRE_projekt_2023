import { getDatabase, ref, set, get } from 'firebase/database'; // Import Firebase database functions

// Import the Firebase app instance, auth, and user if needed
import { app, auth } from './firebaseConfig'; // Update the path to your firebaseConfig file

// Function to synchronize data between local storage and Firebase for the current user
function synchronizeUserData() {
  // Get the current user
  const user = auth.currentUser;
  if (!user) {
    console.log('No user authenticated. Cannot synchronize data.');
    return;
  }

  // Load data from local storage
  const localData = JSON.parse(localStorage.getItem(`userData_${user.uid}`)) || [];

  // Get a reference to the Firebase database
  const db = getDatabase(app);

  // Create a reference path using the user's UID
  const firebasePath = `user_data/${user.uid}`;

  // Create a reference with the specified path
  const dbRef = ref(db, firebasePath);

  // Save data to Firebase
  set(dbRef, localData)
    .then(() => {
      console.log('Data synchronized to Firebase:', localData);
    })
    .catch((error) => {
      console.error('Error saving data to Firebase:', error);
    });

  // Refresh local storage with data from Firebase
  get(dbRef)
    .then((snapshot) => {
      const firebaseData = snapshot.val();
      if (firebaseData) {
        localStorage.setItem(`userData_${user.uid}`, JSON.stringify(firebaseData));
        console.log('Local storage refreshed with Firebase data:', firebaseData);
      }
    })
    .catch((error) => {
      console.error('Error fetching data from Firebase:', error);
    });
}

// Synchronize data every second (adjust the interval as needed)
setInterval(synchronizeUserData, 1000);
