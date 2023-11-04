import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirestore } from 'firebase/firestore';

const app = firebase.initializeApp({
	apiKey: 'REPLACE',
	authDomain: 'room-investigation.firebaseapp.com',
	projectId: 'room-investigation',
	storageBucket: 'room-investigation.appspot.com',
	messagingSenderId: 'REPLACE',
	appId: 'REPLACE',
});

export const auth = app.auth();
export default app;
export const db = getFirestore(app);
