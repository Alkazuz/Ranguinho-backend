import fuctions from 'firebase-functions'

exports.myFunction = functions.firestore
  .document('my-collection/{docId}')
  .onWrite((change, context) => { /* ... */ });