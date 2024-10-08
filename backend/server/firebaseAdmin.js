const admin = require('firebase-admin');
const serviceAccount = require('../config/firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'employee-app-node-react.appspot.com' 
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { db, bucket };
