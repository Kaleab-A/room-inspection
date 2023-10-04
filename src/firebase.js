import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirestore } from 'firebase/firestore';

const app = firebase.initializeApp({
	apiKey: 'AIzaSyBq13dub61kAtO34n2m_KJ4GLwRX7DMbng',
	authDomain: 'room-investigation.firebaseapp.com',
	projectId: 'room-investigation',
	storageBucket: 'room-investigation.appspot.com',
	messagingSenderId: '932578494942',
	appId: '1:932578494942:web:7f20685ef1a41d229fb54f',
});

export const auth = app.auth();
export default app;
export const db = getFirestore(app);
