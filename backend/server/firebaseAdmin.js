const admin = require('firebase-admin');
const serviceAccount = require('../config/firebase-service-account.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'https://console.firebase.google.com/project/employee-app-node-react/storage/employee-app-node-react.appspot.com/files'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { db, bucket };
