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

$(document).ready(function () {
    $("input").change(function () {
        if ($(this).is(':checked')) {
            console.log("adding maintenance to firebase")
            var today = new Date();
            var year = today.getFullYear();
            var mon = today.getMonth();
            var day = today.getDate();
            var hr = today.getHours();
            var min = today.getMinutes()+2;
            console.log('today info before massaging: ' + year+mon+day+hr+min);
            if(mon < 10){
                mon = '0'+mon;
            }
            if(day < 10){
                day = '0'+day;
            }
            if (hr < 10){
                hr = '0'+hr;
            }
            if ( min < 10){
                min = '0'+min;
            }
            var date = ''+year+mon+day+hr+min;
            console.log('today info after massaging: ' + date);
            db.collection("maintenance").add({
                ownerID: localStorage.getItem("loggedInUUID"),
                homeID: localStorage.getItem("currentHomeID"),
                msg: $(this).attr('value'),
                maintName: $(this).attr('id'),
                maintID: localStorage.getItem("currentHomeID") + $(this).attr('id'),
                dueDate: date
            })
                .then((docRef) => {
                    console.log("Document written with ID: ", docRef.id);
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });
        } else {
            console.log("deleting maintenance from firebase")
            db.collection("maintenance").where("maintID", "==", localStorage.getItem("currentHomeID") + $(this).attr('id'))
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        console.log(doc.id)
                        db.collection("maintenance").doc(doc.id).delete().then(() => {
                            console.log("Document successfully deleted!");
                        }).catch((error) => {
                            console.error("Error removing document: ", error);
                        });
                    })
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
        }
    });
});

function onLoad() {
    if (localStorage.getItem("loggedInUUID") == null && !window.location.href.includes("/homes.html")) {
        location.replace("/login.html");
    } else {
        db.collection("homes").where("ownerID", "==", localStorage.getItem("loggedInUUID"))
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    var x = document.getElementById("homes");
                    var option = document.createElement("option");
                    option.text = doc.data().homeName;
                    option.value = doc.data().homeID;
                    x.add(option);
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });

            db.collection("maintenance").where("homeID", "==", localStorage.getItem("currentHomeID"))
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.data())
                    document.getElementById(doc.data().maintName).checked = true;
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });

        var docRef = db.collection('homes').doc(localStorage.getItem("currentHomeID"))
        docRef.get().then((doc) => {
            document.getElementById('homes-name').value = doc.data().homeName;
            document.getElementById('homes-stAddress').value = doc.data().stAddress;
            document.getElementById('homes-city').value = doc.data().city;
            document.getElementById('homes-state').value = doc.data().state;
            document.getElementById('homes-zip').value = doc.data().zip;
            document.getElementById('homes-sqft').value = doc.data().sqft;
            document.getElementById('homes-numBdRms').value = doc.data().numRooms;
            document.getElementById('homes-numBthRms').value = doc.data().numBthRooms;
            document.getElementById('homes-flooring').value = doc.data().floorType;
            document.getElementById('homes-yearBuilt').value = doc.data().yrBuilt;
            document.getElementById('homes-heating').value = doc.data().heating;
            document.getElementById('homes-cooling').value = doc.data().cooling;
            document.getElementById('homes-hoaFee').value = doc.data().HOAFees;
            document.getElementById('homes-lotSize').value = doc.data().lotSize;
        })
        var queryIdx = 0;
        db.collection("homeImages").where("homeID", "==", localStorage.getItem("currentHomeID"))
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    var x = document.getElementById("homeSlideShow").img;
                    var img = document.createElement("IMG");
                    img.setAttribute("src", doc.data().url);
                    if (queryIdx == 0) {
                        img.setAttribute("style", "margin-left: auto; margin-right: auto; display: block;")
                    } else {
                        img.setAttribute("style", "margin-left: auto; margin-right: auto; display: none;")
                    }
                    img.setAttribute("width", "50%");
                    img.setAttribute("height", "auto");
                    document.getElementById("homeSlideShow").appendChild(img);
                    queryIdx++;
                })
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
        document.getElementById("Details").style.display = "block";

        db.collection("maintenance").where("homeID", "==", localStorage.getItem("currentHomeID"))
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("maintID: " + doc.data().maintID)
                    document.getElementById(doc.data().maintName).checked = true;
                })
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });

            db.collection("leases").where("homeID", "==", localStorage.getItem("currentHomeID"))
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("Lease Details: " + doc.data())
                    document.getElementById('rental-status').value = doc.data().status;
                    document.getElementById('rental-startDate').value = doc.data().startDate;
                    document.getElementById('rental-endDate').value = doc.data().endDate;
                    document.getElementById('rental-amount').value = doc.data().rentAmount;
                    document.getElementById('rental-deposit').value = doc.data().depositAmount;
                    document.getElementById('leaseDetailsAdendums').value = doc.data().adendums;
                })
            })
            .catch((error) => {
                console.log("Error getting lease documents: ", error);
            });
    }
}

function changeHouseID() {
    var houseID = document.getElementById("homes").value;
    localStorage.setItem("currentHomeID", houseID);
    var docRef = db.collection('homes').doc(localStorage.getItem("currentHomeID"))
    docRef.get().then((doc) => {
        document.getElementById('homes-name').value = doc.data().homeName;
        document.getElementById('homes-stAddress').value = doc.data().stAddress;
        document.getElementById('homes-city').value = doc.data().city;
        document.getElementById('homes-state').value = doc.data().state;
        document.getElementById('homes-zip').value = doc.data().zip;
        document.getElementById('homes-sqft').value = doc.data().sqft;
        document.getElementById('homes-numBdRms').value = doc.data().numRooms;
        document.getElementById('homes-numBthRms').value = doc.data().numBthRooms;
        document.getElementById('homes-flooring').value = doc.data().floorType;
        document.getElementById('homes-yearBuilt').value = doc.data().yrBuilt;
        document.getElementById('homes-heating').value = doc.data().heating;
        document.getElementById('homes-cooling').value = doc.data().cooling;
        document.getElementById('homes-hoaFee').value = doc.data().HOAFees;
        document.getElementById('homes-lotSize').value = doc.data().lotSize;
    })

    var z = document.getElementById("homeSlideShow");
    while (z.firstChild) {
        z.removeChild(z.firstChild);
    }

    var queryIdx2 = 0;
    db.collection("homeImages").where("homeID", "==", localStorage.getItem("currentHomeID"))
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var x = document.getElementById("homeSlideShow").img;
                var img = document.createElement("IMG");
                img.setAttribute("src", doc.data().url);
                if (queryIdx2 == 0) {
                    img.setAttribute("style", "margin-left: auto; margin-right: auto; display: block;")
                } else {
                    img.setAttribute("style", "margin-left: auto; margin-right: auto; display: none;")
                }
                img.setAttribute("width", "50%");
                img.setAttribute("height", "auto");
                document.getElementById("homeSlideShow").appendChild(img);
                queryIdx2++;
            })
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

    $.each($("input[name='maintenance']:checked"), function () {
        console.log('clearing boxes' + $(this).val())
        document.getElementById($(this).attr("id")).checked = false;
    });

    //update checkboxes when house ID is changed
    db.collection("maintenance").where("homeID", "==", localStorage.getItem("currentHomeID"))
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log("maintID: " + doc.data().maintID)
                document.getElementById(doc.data().maintName).checked = true;
            })
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

        db.collection("leases").where("homeID", "==", localStorage.getItem("currentHomeID"))
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log("Lease Details: " + doc.data())
                document.getElementById('rental-status').value = doc.data().status;
                document.getElementById('rental-startDate').value = doc.data().startDate;
                document.getElementById('rental-endDate').value = doc.data().endDate;
                document.getElementById('rental-amount').value = doc.data().rentAmount;
                document.getElementById('rental-deposit').value = doc.data().depositAmount;
                document.getElementById('leaseDetailsAdendums').value = doc.data().adendums;
            })
        })
        .catch((error) => {
            console.log("Error getting lease documents: ", error);
        });

}

function updateHouse() {
    db.collection("maintenance").where("homeID", "==", localStorage.getItem("currentHomeID"))
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log("maintID: " + doc.data().maintID)
            document.getElementById(doc.data().maintName).checked = true;
        })
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

    db.collection("homes").doc(localStorage.getItem("currentHomeID")).update({
        ownerID: localStorage.getItem("loggedInUUID"),
        homeName: document.getElementById('homes-name').value,
        stAddress: document.getElementById('homes-stAddress').value,
        city: document.getElementById('homes-city').value,
        state: document.getElementById('homes-state').value,
        zip: document.getElementById('homes-zip').value,
        sqft: document.getElementById('homes-sqft').value,
        numRooms: document.getElementById('homes-numBdRms').value,
        numBthRooms: document.getElementById('homes-numBthRms').value,
        floorType: document.getElementById('homes-flooring').value,
        yrBuilt: document.getElementById('homes-yearBuilt').value,
        heating: document.getElementById('homes-heating').value,
        cooling: document.getElementById('homes-cooling').value,
        HOAFees: document.getElementById('homes-hoaFee').value,
        lotSize: document.getElementById('homes-lotSize').value
    })

}

function updateLease(){

    db.collection('leases').doc(localStorage.getItem("currentHomeID")).set({
        homeID: localStorage.getItem("currentHomeID"),
        status: document.getElementById('rental-status').value,
        startDate: document.getElementById('rental-startDate').value,
        endDate: document.getElementById('rental-endDate').value,
        rentAmount: document.getElementById('rental-amount').value,
        depositAmount: document.getElementById('rental-deposit').value,
        adendums: document.getElementById('leaseDetailsAdendums').value
    });

}

var slideIndex = 0;
showDivs(slideIndex);

function plusDivs(n) {
    showDivs(slideIndex += n);
}

function showDivs(n) {
    //console.log("n: " + n);
    var i;
    var x = document.getElementById("homeSlideShow");
    //console.log("x length: " + x.children.length);
    if (n > x.children.length - 1) { slideIndex = 0 }
    if (n < 0) { slideIndex = x.children.length }
    //console.log("slide index 1: " + slideIndex)
    for (i = 0; i < x.children.length; i++) {
        //console.log("i: " + i)
        x.children[i].style.display = "none";
    }
    //console.log("slide index 2: " + slideIndex)
    x.children[slideIndex].style.display = "block";
}

function signOut() {
    auth.signOut().then(() => {
        console.log("user is signed out");
        localStorage.clear();
        location.replace("/login.html");
    })
}

/*
 * New Script for Tabs
 */
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function setATab(tabName) {
    console.log("showing " + tabName)
    document.getElementById(tabName).style.display = "block";
}

function removeHouse(){
    console.log('Deleting house');
    db.collection("homeImages").where("homeID", "==", localStorage.getItem("currentHomeID"))
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log("homeImages: " + doc.id)
            db.collection("homeImages").doc(doc.id).delete().then(() => {
                console.log("Document successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
            
        })
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

    db.collection("homes").where("homeID", "==", localStorage.getItem("currentHomeID"))
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log("homes: " + doc.id)
            db.collection("homes").doc(doc.id).delete().then(() => {
                console.log("Document successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        })
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

    db.collection("leases").where("homeID", "==", localStorage.getItem("currentHomeID"))
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log("leases: " + doc.id)
            db.collection("leases").doc(doc.id).delete().then(() => {
                console.log("Document successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        })
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

    db.collection("maintenance").where("homeID", "==", localStorage.getItem("currentHomeID"))
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log("maintenance: " + doc.id);
            db.collection("maintenance").doc(doc.id).delete().then(() => {
                console.log("Document successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        })
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

    db.collection("homes").where("ownerID", "==", localStorage.getItem("loggedInUUID"))
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log("home id: " + doc.id);
            localStorage.setItem("currentHomeID", doc.id);
        })
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
    //location.reload();
}