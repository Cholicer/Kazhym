import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export default defineNuxtPlugin(nuxtApp => {
	const config = useRuntimeConfig();

	const firebaseConfig = {
		apiKey: config.FIREBASE_API_KEY,
		authDomain: "kazhym-e0190.firebaseapp.com",
		projectId: "kazhym-e0190",
		storageBucket: "kazhym-e0190.appspot.com",
		messagingSenderId: "907994215108",
		appId: "1:907994215108:web:e2fd66dfa73cc5f1da8f91",
	};
	const app = initializeApp(firebaseConfig);

	initUser();

	const auth = getAuth(app);
	const db = getFirestore(app);

	nuxtApp.provide("auth", auth);
	nuxtApp.vueApp.provide("auth", auth);
	nuxtApp.provide("db", db);
	nuxtApp.vueApp.provide("db", db);
});
