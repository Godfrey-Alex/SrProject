localStorage.setItem("imageJSON", '{"images":[');

function uploadRef() {
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


  //====================================
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