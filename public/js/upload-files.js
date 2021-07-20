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
var cred;

//Copy from here and above

function uploadRef() {
  console.log("Upload Image clicked!")
  const ref = firebase.storage().ref();
  const file = document.querySelector("#photos").files
  console.log(file.length)
  for (i = 0; i < file.length; i++) {
    const name = new Date() + '_' + file[i].name;
    const metadata = {
      contentType: file[i].type
    }
    const task = ref.child(name).put(file[i], metadata)
    task.then(snapshot => snapshot.ref.getDownloadURL()).then(url => {
      console.log(url);
    })
  }
}

function onLoad() {
  console.log("newHome page onLoad function called");
}

function signOut() {
  auth.signOut().then(() => {
    console.log("user is signed out");
    localStorage.clear();
    location.reload();
  })
}