
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
    // Explicitly provide the environment variables that need to be available in the client code
    'import.meta.env.VITE_EMULATOR': JSON.stringify(process.env.VITE_EMULATOR || 'false'),
    'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify("AIzaSyD3ZQYPtVHk4w63bCvOX0b8RVJyybWyOqU"),
    'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify("neotech-erp.firebaseapp.com"),
    'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify("neotech-erp"),
    'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify("neotech-erp.firebasestorage.app"),
    'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify("803661896660"),
    'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify("1:803661896660:web:94f17531b963627cbd5441")
  },
}));
