//const { auth } = require("firebase-admin");

//const { auth } = require("firebase-admin");
var cred;

function onLoad(){
    console.log("on page load ");
    console.log("checking local storage for UUID " + localStorage.getItem("loggedInUUID"));
    if(localStorage.getItem("loggedInUUID")!=null){
        location.replace("/profile.html");
    }else{
        //document.getElementById("userIDDisplay").innerHTML = localStorage.getItem("loggedInUUID");
    }
}

function goToSignIn(){
    location.replace("/login.html")
}

function createAccount(){
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;
    console.log("username: "+ username + " password: " + password);
    auth.createUserWithEmailAndPassword(username, password).then(
        cred=>{
            localStorage.setItem("loggedInUUID", cred.user.uid);
            db.collection('users').doc(localStorage.getItem("loggedInUUID")).set({
                City: document.getElementById('signup-City').value,
                DisplayName: document.getElementById('signup-displayName').value,
                PhoneNumber: document.getElementById('signup-PhoneNumber').value,
                State: document.getElementById('signup-State').value,
                Street: document.getElementById('signup-Street').value,
                UUID: localStorage.getItem("loggedInUUID"),
                email: document.getElementById('signup-username').value,
                zip: document.getElementById('signup-Postal').value,
            });
            console.log('signup: ' + cred);
            console.log('signup: ' + cred.user);
        }
    );
}

function signOut(){
    auth.signOut().then(()=>{
       console.log("user is signed out");
       localStorage.clear();
       location.reload();
    })
}