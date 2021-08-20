(()=>
{
"use strict";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyA9XWvogprb258UooA5f0VjUBhoY74juOY",
    authDomain: "fir-chat-d4ee0.firebaseapp.com",
    projectId: "fir-chat-d4ee0",
    storageBucket: "fir-chat-d4ee0.appspot.com",
    messagingSenderId: "288682524047",
    appId: "1:288682524047:web:a4d239403a62a2e84e9ffa",
    measurementId: "G-33FR3YCB1L"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  const db=firebase.firestore();
  db.settings({
	merge:true,
	timestampsInSnapshots: true
  });
  const collection = db.collection('messages');
  const auth = firebase.auth();
  let me = null;
  
  const message = document.getElementById('message');
  const form = document.querySelector('form');
  const messages = document.getElementById('messages');
  const login = document.getElementById('login');
  const logout = document.getElementById('logout');
  
  login.addEventListener('click', () => {
	auth.signInAnonymously();
  });
  
  logout.addEventListener('click', () => {
	auth.signOut();
  });
  
  auth.onAuthStateChanged(user => {
	if (user) {
	  me = user;
	  while(messages.firstChild){
		  messages.removeChild(messages.firstChild);
	  }
	  collection.orderBy('created').onSnapshot(snapshot => {
		snapshot.docChanges().forEach(change => {
		  if (change.type === 'added') {
			const li = document.createElement('li');
			const d = change.doc.data();
			li.textContent = d.uid.substr(0, 8) + ': ' + d.message;
			messages.appendChild(li);
		  }
		},error=>{console.log(error)});
	  });
	  console.log(`Logged in as: ${user.uid}`);
	  login.classList.add('hidden');
	  [logout, form, messages].forEach(el => {
		el.classList.remove('hidden');
	  });
	  message.focus();
	  return;
	}
	me = null;
	console.log('Nobody is logged in');
	login.classList.remove('hidden');
	[logout, form, messages].forEach(el => {
	  el.classList.add('hidden');
	});
  });
  
  form.addEventListener('submit', e => {
	e.preventDefault();
  
	const val = message.value.trim();
	if (val === "") {
	  return;
	}
  
	message.value = '';
	message.focus();
  
	collection.add({
	  message: val,
	  created: firebase.firestore.FieldValue.serverTimestamp(),
	  uid: me ? me.uid : 'nobody'
	})
	.then(doc => {
	  console.log(`${doc.id} added!`);
	})
	.catch(error => {
	  console.log(error);
	});
  });
})();