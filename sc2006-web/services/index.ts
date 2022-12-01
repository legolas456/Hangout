import { EventService } from './EventService';
import { MeService } from './MeService';
import { NotificationService } from './NotificationService';
import { UserService } from './UserService';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: "AIzaSyBWtPb1Pq8rNtMpD2t8HsiYosC654eqm34",
  	authDomain: "sc2006-final.firebaseapp.com",
  	projectId: "sc2006-final",
  	storageBucket: "sc2006-final.appspot.com",
  	messagingSenderId: "515532668274",
  	appId: "1:515532668274:web:92906c4129f2f7e88331eb",
	measurementId: 'G-WL31NG5QE4',
};
const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
export const meService = new MeService();
export const notificationService = new NotificationService();
export const userService = new UserService();
export const eventService = new EventService();
