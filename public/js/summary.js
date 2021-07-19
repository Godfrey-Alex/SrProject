function onLoad() {
    if (localStorage.getItem("loggedInUUID") == null && !window.location.href.includes("/homes.html")) {
        location.replace("/login.html");
    } else {
        //var homesRef = db.collection("homes");
        //var query = homesRef.where("homeOwner", "=", localStorage.getItem("loggedInUUID"))
        //console.log('running query on homes for user id: ' + localStorage.getItem("loggedInUUID"));
        //console.log('current homeID: ' + localStorage.getItem("currentHomeID"));
        db.collection("homes").where("ownerID", "==", localStorage.getItem("loggedInUUID"))
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    var div = document.createElement('div');
                    div.id = "slideshow-block" + doc.data().homeID;
                    div.className = "btn"// slideshow-block" + doc.data().homeID;
                    div.innerHTML = "<h3>" + doc.data().homeName + "</h3><br><div id=\"" + doc.data().homeID + "images\"></div><p>" + doc.data().stAddress + "<br>" + doc.data().city + ", " + doc.data().state + "</p>";
                    div.style = "height: 415px";
                    //var oldDiv = document.getElementById('parent');
                    document.getElementById('parent').appendChild(div);

                    var ul = document.createElement('ul');
                    ul.className = "lightSlider" + doc.data().homeID;
                    ul.id = "lightSlider" + doc.data().homeID;
                    var obj2 = document.getElementById("slideshow-block" + doc.data().homeID);
                    obj2.appendChild(ul);

                    var btn = document.createElement("BUTTON");
                    btn.value = doc.data().homeID;
                    btn.innerHTML = "View Home";
                    btn.className = "button";
                    obj2.appendChild(btn);

                    //var li = document.createElement('li');
                    //li.className = "li"+doc.data().homeID


                    //div.id = doc.data().homeID;
                    // div.className = "slideshow-block" + doc.data().homeID;
                    //div.innerHTML = "<h3>" + doc.data().homeName + "</h3><br><div id=\"" + doc.data().homeID + "images\"></div><p>" + doc.data().stAddress + "<br>" + doc.data().city + ", " + doc.data().state + "</p>";
                    //div.style = "height: 300px";
                    //document.getElementById('parent').appendChild(div);

                    var queryIdx = 0;
                    db.collection("homeImages").where("homeID", "==", doc.data().homeID)
                        .get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                var x = document.getElementById(doc.data().homeID + "images");
                                var img = document.createElement("IMG");
                                img.setAttribute("src", doc.data().url);
                                if (queryIdx == 0) {
                                    img.setAttribute("style", "margin-left: auto; margin-right: auto; display: block;")
                                } else {
                                    img.setAttribute("style", "margin-left: auto; margin-right: auto; display: none;")
                                }
                                img.setAttribute("width", "40%");
                                img.setAttribute("height", "auto");
                                document.getElementById(doc.data().homeID + "images").appendChild(img);
                                queryIdx++;
                            })
                        })
                        .catch((error) => {
                            console.log("Error getting documents: ", error);
                        });

                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }
}

function signOut() {
    auth.signOut().then(() => {
        console.log("user is signed out");
        localStorage.clear();
        location.replace("/login.html");
    })
}

$(document).ready(function () {
      $(document).on('click','.button',function(){
        //alert("btn clicked"+ $(this).val())
        localStorage.setItem("currentHomeID", $(this).val());
        location.replace("/homes.html");
      });
});
