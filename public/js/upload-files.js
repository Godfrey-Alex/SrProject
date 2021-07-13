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