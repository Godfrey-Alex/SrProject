var path = require('path');
require('dotenv').config()
const nodemailer = require('nodemailer')
const express = require('express')
const fs = require('firebase-admin')
const serviceAccount = require('./api_keys/nodeServer_api_key.json');
const app = express()
const interval = 15000;var name;
var email;
var homeName;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("port", (process.env.PORT || 3000));

app.use(express.static("public"));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/login.html', (req, res) => res.send(login.html))
app.get('/signup.html', (req, res) => res.send(signup.html))
app.get('/summary.html', (req, res) => res.send(summary.html))
app.get('/homes.html', (req, res) => res.send(homes.html))
app.get('/newHome.html', (req, res) => res.send(newHome.html))
app.get('/profile.html', (req, res) => res.send(profile.html))
app.get('/test.html', (req, res) => res.send(test.html))

app.get('/sped.html', (req, res) => res.send(sped.html))

fs.initializeApp({
  credential: fs.credential.cert(serviceAccount)
});

const db = fs.firestore();


function alerts() {
  var today = new Date();
  var year = today.getFullYear();
  var mon = today.getMonth();
  var day = today.getDate();
  var hr = today.getHours();
  var min = today.getMinutes();
  if (mon < 10) {
    mon = '0' + mon;
  }
  if (day < 10) {
    day = '0' + day;
  }
  if (hr < 10) {
    hr = '0' + hr;
  }
  if (min < 10) {
    min = '0' + min;
  }
  var date = '' + year + mon + day + hr + min;
  console.log('Alerts matching: ' + year + mon + day + hr + min);

  const query = db.collection('maintenance').where('dueDate', '==', date);
  const observer = query.onSnapshot(querySnapshot => {
    console.log(`Received query snapshot of user, of size ${querySnapshot.size}`);
    querySnapshot.forEach((doc) => {
      console.log(doc.data())
      send(doc.data().ownerID, doc.data().homeID, doc.data().msg)
    })
  }, err => {
    console.log(`Encountered error: ${err}`);
  });
}

function intervalFunc() {
  console.log('Running query');
  alerts();
}

setInterval(intervalFunc, interval);

function send(ownerID, homeID, message) {
  console.log('Trying to send emails. ownerID: ' + ownerID + ' homeID: '+ homeID + ' msg: ' + message);

  const query = db.collection('users').where('UUID', '==', ownerID);
  const observer = query.onSnapshot(querySnapshot => {
    console.log(`Received query snapshot of size ${querySnapshot.size}`);
    querySnapshot.forEach((doc) => {
      console.log('inside query loop - > ' + doc.data() + 'displayName: ' + doc.data().DisplayName + ' email: ' + doc.data().email)
      name = doc.data().DisplayName;
      email = doc.data().email;
    })
  }, err => {
    console.log(`Encountered error: ${err}`);
  });

  const query1 = db.collection('homes').where('homeID', '==', homeID);
  const observer1 = query1.onSnapshot(querySnapshot => {
    console.log(`Received query snapshot of size ${querySnapshot.size}`);
    querySnapshot.forEach((doc) => {
      console.log('homeID: ' + doc.data().homeID + ' homeName: '+ doc.data().homeName)
      homeName = doc.data().homeName;
    })
  }, err => {
    console.log(`Encountered error: ${err}`);
  });

  console.log(' outside query loop - > display name: ' + name + ' email address: ' + email);

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASSWORD
    }
  });

  let mailOptions = {
    from: 'alexbrittanyg@gmail.com',
    to: email,
    subject: homeName + ' Maintenance Reminder',
    text: message + ' at your ' + homeName
  }

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log('Error: ', err)
    } else {
      console.log('Email has been sent')
    }
  })


  /**REmoved the code here from Mailjet */
}




app.listen(app.get("port"), () => {
  console.log('My Home Manager listening at localhost:' + app.get("port"))
  //send();
})

