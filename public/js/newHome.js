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
  window.alert('Please do not navigate away from this page until upload is complete. Please be patient. The page will redirect when complete')
  function upload() {
    db.collection("homes").add({
      ownerID: localStorage.getItem("loggedInUUID"),
      homeName: document.getElementById('newHome-name').value,
      stAddress: document.getElementById('newHome-stAddress').value,
      city: document.getElementById('newHome-city').value,
      state: document.getElementById('newHome-state').value,
      zip: document.getElementById('newHome-zip').value,
      sqft: document.getElementById('newHome-sqft').value,
      numRooms: document.getElementById('newHome-numBdRms').value,
      numBthRooms: document.getElementById('newHome-numBthRms').value,
      floorType: document.getElementById('newHome-flooring').value,
      yrBuilt: document.getElementById('newHome-yearBuilt').value,
      heating: document.getElementById('newHome-heating').value,
      cooling: document.getElementById('newHome-cooling').value,
      HOAFees: document.getElementById('newHome-hoaFee').value,
      lotSize: document.getElementById('newHome-lotSize').value
    })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        localStorage.setItem("currentHomeID", docRef.id);
        db.collection('homes').doc(docRef.id).update({
          homeID: localStorage.getItem("currentHomeID")
        });
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
    console.log("Upload Image clicked!")
    const ref = firebase.storage().ref();
    const file = document.querySelector("#photos").files;
    var time = 15000*file.length;
    console.log(file.length)
    for (i = 0; i < file.length; i++) {
      console.log('i: ' + i + ' file.length: ' + file.length)
      const name = new Date() + '_' + file[i].name;
      const metadata = {
        contentType: file[i].type
      }
      const task = ref.child(name).put(file[i], metadata)
      task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
          console.log("added URL: " + url);
          db.collection("homeImages").add({
            url: url,
            homeID: localStorage.getItem("currentHomeID")
          })
        })
    }

    setTimeout(() => {
      location.replace("/summary.html");
    }, time)
  }



  upload()
}

function onLoad() {
  if (localStorage.getItem("loggedInUUID") == null && !window.location.href.includes("/homes.html")) {
    location.replace("/login.html");
}
}

function signOut() {
  auth.signOut().then(() => {
    console.log("user is signed out");
    localStorage.clear();
    location.reload();
  })
}