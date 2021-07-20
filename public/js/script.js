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

//function login(){
    //window.alert("Clicked Login");
//}

 function goToSignUp(){
    location.replace("/signup.html")
 }

 function onLoad(){
     console.log("on page load ");
     console.log("checking local storage for UUID " + localStorage.getItem("loggedInUUID"));
     if(localStorage.getItem("loggedInUUID")==null){
         location.replace("/login.html");
     }else{
         location.replace("/profile.html");
     }
 }

function goToSignIn(){
    location.replace("/login.html")
}

 function login(){
     const username = document.getElementById("login-email").value;
     const password = document.getElementById("login-pwd").value;
     console.log("username: "+ username + " password: " + password);
     auth.signInWithEmailAndPassword(username, password).then(
         cred=>{
             console.log("login " + cred);
             console.log("login " + cred.user);
             //console.log("login " + cred.user.uid);
             localStorage.setItem("loggedInUUID", cred.user.uid);
             location.replace("/profile.html");
         }
     );
 }

 function createAccount(){
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;
    console.log("username: "+ username + " password: " + password);
    auth.createUserWithEmailAndPassword(username, password).then(
        cred=>{
            console.log(cred);
            console.log(cred.user);
        }
    );

}

 function signOut(){
    auth.signOut().then(()=>{
       console.log("user is signed out");
       localStorage.clear();
    })
}

//auth.onAuthStateChanged(user=>{
    //console.log("onAuthStateChange " + cred);
//})