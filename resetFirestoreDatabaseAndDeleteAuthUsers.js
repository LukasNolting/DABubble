// ausführen via:
// node resetFirestoreDatabaseAndDeleteAuthUsers.js 

const admin = require("firebase-admin");

// Firebase Admin SDK initialisieren
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Neue Grundstruktur der Firestore-Datenbank definieren
const defaultData = {
    users: [
        {
            email: "admin@admin.de",
            name: "Admin",
            photoURL: "/img/avatars/avatar1.svg",
            privateNoteRef: "",
            provider: "password",
            status: true,
            userId: "admin"
        }
    ],
    messages: {},
    channels: [
        {
            id: "allgemein",
            name: "Allgemein",
            description: "Allgemein-Chat",
            createdAt: admin.firestore.Timestamp.now(),
            createdBy: "admin",
            isPrivate: false,
            members: []
        },
        {
            id: "entwickler",
            name: "Entwickler",
            description: "Entwickler-Chat",
            createdAt: admin.firestore.Timestamp.now(),
            createdBy: "admin",
            isPrivate: false,
            members: []
        },
        // {
        //     id: "guestsonly",
        //     name: "Gäste only",
        //     description: "Ein Chat nur für Gäste",
        //     createdAt: admin.firestore.Timestamp.now(),
        //     createdBy: "admin",
        //     isPrivate: false,
        //     members: []
        // }
    ]
};

// Funktion zum Löschen aller Firebase Authentication Benutzer
async function deleteAllUsers(nextPageToken) {
    try {
        const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);

        if (listUsersResult.users.length > 0) {
            const userIds = listUsersResult.users.map(user => user.uid);

            // Lösche Benutzer in Batches
            await admin.auth().deleteUsers(userIds);
            console.log(`Gelöschte Benutzer: ${userIds.length}`);
        }

        // Falls es weitere Benutzer gibt, nächste Seite abrufen
        if (listUsersResult.pageToken) {
            await deleteAllUsers(listUsersResult.pageToken);
        } else {
            console.log("Alle Firebase Authentication Benutzer wurden gelöscht.");
        }
    } catch (error) {
        console.error("Fehler beim Löschen der Benutzer:", error);
    }
}

async function resetDatabase() {
    try {
        console.log("Lösche aktuelle Daten...");
        const collections = await db.listCollections();
        for (const collection of collections) {
            const snapshot = await collection.get();
            snapshot.forEach(async (doc) => {
                await doc.ref.delete();
            });
        }

        console.log("Setze Standardwerte...");

        // users und messages initialisieren
        for (const user of defaultData.users) {
            await db.collection("users").doc(user.userId).set(user);
        }

        await db.collection("messages").doc("default").set({ placeholder: true });

        // channels als einzelne Dokumente speichern
        for (const channel of defaultData.channels) {
            await db.collection("channels").doc(channel.id).set(channel);
        }

        console.log("Datenbank erfolgreich zurückgesetzt!");
    } catch (error) {
        console.error("Fehler beim Zurücksetzen der Datenbank:", error);
    }
}

// Hauptfunktion: Erst Auth-Daten löschen, dann Firestore resetten, dann Admin erstellen
async function main() {
    console.log("🚀 Starte Zurücksetzen der Firebase-Datenbank und Authentication...");
    await deleteAllUsers(); // Löscht alle Benutzer aus Firebase Authentication
    await resetDatabase(); // Setzt Firestore zurück
    console.log("✅ Zurücksetzen abgeschlossen!");
}

// Skript ausführen
main();