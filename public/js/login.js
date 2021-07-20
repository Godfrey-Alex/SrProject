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


function login() {

    function handleLogin() {
        console.log('running 1st')
        const username = document.getElementById("login-email").value;
        const password = document.getElementById("login-pwd").value;
        console.log("username: " + username + " password: " + password);
        auth.signInWithEmailAndPassword(username, password).then(
            cred => {
                console.log("login " + cred);
                console.log("login " + cred.user);
                console.log("login " + cred.user.uid);
                localStorage.setItem("loggedInUUID", cred.user.uid);
                location.replace("/summary.html");
            }
        );
        setTimeout(() => {
            console.log('running 2nd')
            if (localStorage.getItem("loggedInUUID") == null) {                
                var p = document.createElement('p');
                var txt = document.createTextNode('The username or password entered is incorrect. Please double check your credentials.')
                p.appendChild(txt);
                var div = document.getElementById('authError');
                div.appendChild(p);
            }
        }, 500);
        //console.log('running 2nd');
    }
    handleLogin();
}

function goToSignUp() {
    location.replace("/signup.html")
}

function onLoad() {
    //console.log("on page load ");
    //console.log("checking local storage for UUID " + localStorage.getItem("loggedInUUID"));
    if (localStorage.getItem("loggedInUUID") != null) {
        location.replace("/summary.html");
    } else {
        //location.replace("/profile.html");
    }
}