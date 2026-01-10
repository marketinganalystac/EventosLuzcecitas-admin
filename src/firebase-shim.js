/**
 * CONFIGURACIÓN DE FIREBASE CENTRALIZADA
 * Aquí debes colocar las credenciales de tu proyecto de Firebase.
 * Ambas apps (la de administración y esta) deben apuntar al mismo projectId.
 */

const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto", // Este debe ser el mismo en ambas apps
  storageBucket: "tu-proyecto.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

if (typeof window !== 'undefined') {
  window.__firebase_config = JSON.stringify(firebaseConfig);
  // El appId ayuda a organizar las colecciones dentro de Firestore
  window.__app_id = "luzcecitas-app-compartida"; 
  window.__initial_auth_token = null;
}
