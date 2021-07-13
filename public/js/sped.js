// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyDcTaYVHzHbL1z6UT7SuOqQZIbo-oxjak4",
    authDomain: "my-home-manager-d4283.firebaseapp.com",
    projectId: "my-home-manager-d4283",
    storageBucket: "my-home-manager-d4283.appspot.com",
    messagingSenderId: "757011852605",
    appId: "1:757011852605:web:b668c8fec536e2317ae954",
    measurementId: "G-E4DR7SSPWE"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//make auth and firestore references
const auth = firebase.auth();
const db = firebase.firestore();

db.settings({ timestampsInSnapshots: true });

firebase.analytics();

function writeToFB() {
    console.log('Sending Data to Firebase')

    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;

    db.collection("SPED").add({
        exists: 'true',
        name: name,
        age: age
    })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });

    updatePage();

}

function updatePage() {
    console.log('updating page on load or after update')

    db.collection("SPED").where("exists", "==", "true")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id + ' ' + doc.data())
                const para = document.createElement("p");
                const node = document.createTextNode(doc.data().name + ' ' + doc.data().age);
                para.appendChild(node);

                const element = document.getElementById("display");
                element.appendChild(para);

            })
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

}