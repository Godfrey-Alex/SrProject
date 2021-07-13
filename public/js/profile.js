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

  /*
    Above is the config for google firebase. 
  */

function onLoad(){
    console.log("on page load ");
    console.log("checking local storage for UUID " + localStorage.getItem("loggedInUUID"));
    if(localStorage.getItem("loggedInUUID")==null && !window.location.href.includes("/login.html")){
        location.replace("/login.html");
    }else{
        //document.getElementById("userIDDisplay").innerHTML = localStorage.getItem("loggedInUUID");
        var docRef = db.collection("users").doc(localStorage.getItem("loggedInUUID"));
        docRef.get().then((doc) => {
            document.getElementById('profile-displayName').value = doc.data().DisplayName;
            document.getElementById('profile-emailAddress').value = doc.data().email;
            document.getElementById('profile-phoneNumber').value = doc.data().PhoneNumber;
            document.getElementById('profile-Street').value = doc.data().Street;
            document.getElementById('profile-City').value = doc.data().City;
            document.getElementById('profile-State').value = doc.data().State;
            document.getElementById('profile-Zip').value = doc.data().zip;          
        })
    }
}

function updateProfile(){
    db.collection('users').doc(localStorage.getItem("loggedInUUID")).update({
        City: document.getElementById('profile-City').value,
        DisplayName: document.getElementById('profile-displayName').value,
        PhoneNumber: document.getElementById('profile-phoneNumber').value,
        State: document.getElementById('profile-State').value,
        Street: document.getElementById('profile-Street').value,
        email: document.getElementById('profile-emailAddress').value,
        zip: document.getElementById('profile-Zip').value,
    });
}

function signOut(){
    auth.signOut().then(()=>{
       console.log("user is signed out");
       localStorage.clear();
       location.reload();
    })
}