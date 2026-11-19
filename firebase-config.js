// Configuração pública do Firebase para o site Padaria Verena.
(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyBsCUbXRnu3RkJmO9gPDeS2R4qK2FihMwY",
    authDomain: "padaria-verena.firebaseapp.com",
    projectId: "padaria-verena",
    storageBucket: "padaria-verena.firebasestorage.app",
    messagingSenderId: "101540531305",
    appId: "1:101540531305:web:b27e8bf138ba7fefb9a6f8"
  };

  try {
    if (!window.firebase) throw new Error("SDK do Firebase não foi carregado.");
    const app = window.firebase.apps.length
      ? window.firebase.app()
      : window.firebase.initializeApp(firebaseConfig);

    window.verenaFirebase = {
      app,
      db: window.firebase.firestore(),
      auth: window.firebase.auth()
    };
    console.info("Firebase da Padaria Verena inicializado.");
  } catch (error) {
    console.error("Não foi possível inicializar o Firebase:", error);
  }
})();