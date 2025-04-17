
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Updated Firebase environment variables
    'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify("AIzaSyDKgLJI-y03tTsGhRmUzY7Q31zzfwVzazA"),
    'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify("neotech-7c574.firebaseapp.com"),
    'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify("neotech-7c574"),
    'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify("neotech-7c574.appspot.com"),
    'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify("375585071827"),
    'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify("1:375585071827:web:3c8d4a02a50a5321086a26")
  },
}));
