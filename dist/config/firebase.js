"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.app = void 0;
require("dotenv/config");
// Import the functions you need from the SDKs you need
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAdnSxELmOGLf-hnztQXULgvEge7eq_a9k",
    authDomain: "ranguinho-70d2d.firebaseapp.com",
    projectId: "ranguinho-70d2d",
    storageBucket: "ranguinho-70d2d.appspot.com",
    messagingSenderId: "641127796845",
    appId: "1:641127796845:web:3b83e7983664d6dc076f64",
    measurementId: "G-NKEVG95TTY"
};
// Initialize Firebase
exports.app = (0, app_1.initializeApp)(firebaseConfig);
exports.db = (0, firestore_1.getFirestore)(exports.app);
console.log("iniciado");
