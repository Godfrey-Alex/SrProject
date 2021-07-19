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

function onLoad() {
    console.log("on page load ");
    console.log("checking local storage for UUID " + localStorage.getItem("loggedInUUID"));
    if (localStorage.getItem("loggedInUUID") == null && !window.location.href.includes("/login.html")) {
        location.replace("/login.html");
    } else {
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

function updateProfile() {
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

function deleteProfile() {
    console.log('Deleting Profile')

    db.collection("homes").where("ownerID", "==", localStorage.getItem("loggedInUUID"))
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((homesdoc) => {
                console.log("home id: " + homesdoc.id);

                db.collection("homeImages").where("homeID", "==", homesdoc.id)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((homeImages) => {
                            console.log("homeImage to Delete: " + homeImages.id);
                            db.collection('homeImages').doc(homeImages.id).update({
                                deleted: 'true'
                            });
                            db.collection("homeImages").doc(homeImages.id).delete().then(() => {
                                console.log("homeImage successfully deleted!");
                            }).catch((error) => {
                                console.error("Error removing document: ", error);
                            });
                        })
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                    });

                    db.collection("leases").where("homeID", "==", homesdoc.id)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((leasesdoc) => {
                            console.log("lease to Delete: " + leasesdoc.id);
                            db.collection("leases").doc(leasesdoc.id).delete().then(() => {
                                console.log("Document successfully deleted!");
                            }).catch((error) => {
                                console.error("Error removing document: ", error);
                            });
                        })
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                    });


                db.collection("homes").doc(homesdoc.id).delete().then(() => {
                    console.log("Home successfully deleted!");
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });

            })
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

        db.collection("maintenance").where("ownerID", "==", localStorage.getItem("loggedInUUID"))
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((maintdoc) => {
                console.log("maintenance: " + maintdoc.id);
                db.collection("maintenance").doc(maintdoc.id).delete().then(() => {
                    console.log("maintenance item successfully deleted!");
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            })
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

        db.collection("users").doc(localStorage.getItem("loggedInUUID")).delete().then(() => {
            console.log("User successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });

        localStorage.clear();

}

function signOut() {
    auth.signOut().then(() => {
        console.log("user is signed out");
        localStorage.clear();
        location.reload();
    })
}