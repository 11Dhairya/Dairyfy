const { initializeApp } = require('firebase/app');

const firebaseConfig = {
  apiKey: "AIzaSyBitLMngeRPhWQlLCq6LR1BPnOaxyE9HfE",
  authDomain: "dairyfy.firebaseapp.com",
  projectId: "dairyfy",
  storageBucket: "dairyfy.appspot.com",
  messagingSenderId: "258629359078",
  appId: "1:258629359078:web:6d5ca19c472dd70720f227"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);