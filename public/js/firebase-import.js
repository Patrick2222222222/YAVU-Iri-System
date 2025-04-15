// firebase-import.js
const admin = require("firebase-admin");
// In CodeSandbox musst du einen Web API Key verwenden statt eines Service Account
const firebaseConfig = {
  // Kopiere hier deine Firebase-Konfiguration aus der firebase.js Datei
  apiKey: "AIzaSyCRZGVtge36rV3iGMVV_o6qv2hLockYmH8",
  authDomain: "yavu-behandlungsplattform.firebaseapp.com",
  projectId: "yavu-behandlungsplattform",
  storageBucket: "yavu-behandlungsplattform.firebasestorage.app",
  messagingSenderId: "862788536011",
  appId: "1:862788536011:web:ac00348be2950b1a493d4e",
  measurementId: "G-7KXJ5ML4E2",
};

// Da wir in der Browser-Umgebung sind, verwenden wir die Firebase Web SDK
const firebase = require("firebase/app");
require("firebase/firestore");

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Importiere deine Daten aus database.js
const database = require("./database.js");

// Hilfsfunktion zum Erstellen von Batches (um Limits nicht zu überschreiten)
async function batchSet(collection, data) {
  const collectionRef = db.collection(collection);
  const batches = [];
  let batch = db.batch();
  let operationCount = 0;

  for (const item of data) {
    const docRef = collectionRef.doc(item.id.toString());
    batch.set(docRef, item);
    operationCount++;

    // Firebase hat ein Limit von 500 Operationen pro Batch
    if (operationCount >= 450) {
      batches.push(batch.commit());
      batch = db.batch();
      operationCount = 0;
    }
  }

  if (operationCount > 0) {
    batches.push(batch.commit());
  }

  return Promise.all(batches);
}

// Import starten
async function importData() {
  try {
    console.log("Starting import...");

    // Importiere Benutzer
    console.log("Importing users...");
    await batchSet("users", database.users);

    // Importiere Studios
    console.log("Importing studios...");
    await batchSet("studios", database.studios);

    // Und so weiter für weitere Datensammlungen...
    console.log("Importing customers...");
    await batchSet("customers", database.customers);

    console.log("Importing bookings...");
    await batchSet("bookings", database.bookings);

    console.log("Importing messages...");
    await batchSet("messages", database.messages);

    console.log("Importing reviews...");
    await batchSet("reviews", database.reviews);

    console.log("Importing trainings...");
    await batchSet("trainingModules", database.trainingModules);

    console.log("Importing special offers...");
    await batchSet("specialOffers", database.specialOffers);

    console.log("Import complete!");
  } catch (error) {
    console.error("Error during import:", error);
  }
}

// Starte den Import-Prozess
importData();
