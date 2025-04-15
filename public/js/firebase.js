// Firebase-Konfiguration
const firebaseConfig = {
  // Kopiere hier deine Firebase-Konfiguration ein
  apiKey: "AIzaSyCRZGVtge36rV3iGMVV_o6qv2hLockYmH8",
  authDomain: "yavu-behandlungsplattform.firebaseapp.com",
  projectId: "yavu-behandlungsplattform",
  storageBucket: "yavu-behandlungsplattform.firebasestorage.app",
  messagingSenderId: "862788536011",
  appId: "1:862788536011:web:ac00348be2950b1a493d4e",
  measurementId: "G-7KXJ5ML4E2",
};

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);

// Firebase-Dienste initialisieren
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// Exportiere auth für andere Dateien
export { auth };

// Collection-Referenzen erstellen
const usersCollection = db.collection("users");
const studiosCollection = db.collection("studios");
const customersCollection = db.collection("customers");
const bookingsCollection = db.collection("bookings");
const messagesCollection = db.collection("messages");
const reviewsCollection = db.collection("reviews");
const trainingsCollection = db.collection("trainings");

// Firebase-Funktionen zum Ersetzen von localStorage
async function loadFromDatabase() {
  try {
    // Alle relevanten Daten laden
    const usersSnapshot = await usersCollection.get();
    const studiosSnapshot = await studiosCollection.get();
    const customersSnapshot = await customersCollection.get();
    const bookingsSnapshot = await bookingsCollection.get();
    const messagesSnapshot = await messagesCollection.get();
    const reviewsSnapshot = await reviewsCollection.get();
    const trainingsSnapshot = await trainingsCollection.get();

    // Daten in JavaScript-Objekt umwandeln
    const data = {
      users: usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      studios: studiosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
      customers: customersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
      bookings: bookingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
      messages: messagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
      reviews: reviewsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
      trainingModules: trainingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    };

    return data;
  } catch (error) {
    console.error("Fehler beim Laden der Daten:", error);
    return {};
  }
}

async function saveToDatabase(data) {
  try {
    // Hier würden wir normalerweise alle Daten speichern
    // Das ist eine vereinfachte Implementierung
    console.log("Daten werden gespeichert:", data);
    return true;
  } catch (error) {
    console.error("Fehler beim Speichern der Daten:", error);
    return false;
  }
}

// Einzelne Dokumente speichern
async function saveDocument(collection, id, data) {
  try {
    await db.collection(collection).doc(id).set(data);
    return true;
  } catch (error) {
    console.error(`Fehler beim Speichern in ${collection}:`, error);
    return false;
  }
}

// Dokument hinzufügen (ID automatisch generieren)
async function addDocument(collection, data) {
  try {
    const docRef = await db.collection(collection).add(data);
    return docRef.id;
  } catch (error) {
    console.error(`Fehler beim Hinzufügen zu ${collection}:`, error);
    return null;
  }
}

// Dokument aktualisieren
async function updateDocument(collection, id, data) {
  try {
    await db.collection(collection).doc(id).update(data);
    return true;
  } catch (error) {
    console.error(`Fehler beim Aktualisieren in ${collection}:`, error);
    return false;
  }
}

// Dokument löschen
async function deleteDocument(collection, id) {
  try {
    await db.collection(collection).doc(id).delete();
    return true;
  } catch (error) {
    console.error(`Fehler beim Löschen aus ${collection}:`, error);
    return false;
  }
}
