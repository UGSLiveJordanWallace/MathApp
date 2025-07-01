import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_APP_ApiKey,
	authDomain: import.meta.env.VITE_APP_AuthDomain,
	databaseURL: import.meta.env.VITE_APP_DatabaseURL,
	projectId: import.meta.env.VITE_APP_ProjectId,
	storageBucket: import.meta.env.VITE_APP_StorageBucket,
	messagingSenderId: import.meta.env.VITE_APP_MessagingSenderId,
	appId: import.meta.env.VITE_APP_AppId,
	measurementId: import.meta.env.VITE_APP_MeasurementId 
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };
