"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myFunction = functions.firestore
    .document('my-collection/{docId}')
    .onWrite((change, context) => { });
