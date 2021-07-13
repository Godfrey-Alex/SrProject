var cred;

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


 function goToSignUp(){
    location.replace("/signup.html")
 }

 function onLoad(){
    console.log("on page load ");
    console.log("checking local storage for UUID " + localStorage.getItem("loggedInUUID"));
    if(localStorage.getItem("loggedInUUID")!=null){
        location.replace("/profile.html");
    }else{
        //location.replace("/profile.html");
    }
}