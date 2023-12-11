// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  enableIndexedDbPersistence,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRR1tb-zhFpzwvyzrS_ggGCw60Nt3f6Q8",
  authDomain: "canineconnect-5e86d.firebaseapp.com",
  projectId: "canineconnect-5e86d",
  storageBucket: "canineconnect-5e86d.appspot.com",
  messagingSenderId: "831134964041",
  appId: "1:831134964041:web:96685663f5c297d57ba298",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Wrap the rest of your code in the DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function () {
  async function getBreeds(db) {
    const breedCol = collection(db, "breeds");
    const breedSnapshot = await getDocs(breedCol);
    const breedList = breedSnapshot.docs.map((doc) => doc);
    return breedList;
  }

  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == "failed-precondition") {
      console.log("Persistence failed");
    } else if (err.code == "unimplemented") {
      console.log("Persistence is not valid");
    }
  });

  const unsub = onSnapshot(collection(db, "breeds"), (doc) => {
    console.log(doc.docChanges()); //test to see if docs are added/removed
    doc.docChanges().forEach((change) => {
      change, change.doc.data(), change.doc.id;
      if (change.type === "added") {
        // Call render function in UI
        renderBreed(change.doc.data(), change.doc.id);
        showNotification("Breed added", breedData.breed);
      }
      if (change.type === "removed") {
        removeBreed(change.doc.id);
        showNotification("Breed removed", breedData.breed);
      }
    });
  });

  // Add new breed
  const form = document.querySelector("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    addDoc(collection(db, "breeds"), {
      breed: form.title.value,
      description: form.description.value,
    }).catch((error) => console.log(error));
    form.title.value = "";
    form.description.value = "";
  });

  // Delete breed
  const breedContainer = document.querySelector(".breeds");
  breedContainer.addEventListener("click", (event) => {
    if (event.target.tagName === "I") {
      const id = event.target.getAttribute("data-id");
      deleteDoc(doc(db, "breeds", id));
    }
  });
});

//listen for auth status changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User log in: ", user.email);
    getBreeds(db).then((snapshot) => {
      setupBreeds(snapshot);
    });
    setupUI(user);
    const form = document.querySelector("form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      addDoc(collection(db, "breeds"), {
        breed: form.title.value,
        description: form.description.value,
      }).catch((error) => console.log(error));
      form.title.value = "";
      form.description.value = "";
    });
  } else {
    console.log("User Logged out");
    setupUI();
    setupBreeds([]);
  }
});

function showNotification(title, message) {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      new Notification(title, {
        body: message,
      });
    }
  });
}
