import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimizeDeps: {
    include: ["recharts", "react-is"],
  },
  server:{
    host: "0.0.0.0",
    port:5173
  },
  server: {
    host: true,
    allowedHosts: [
      "cataphracted-uncorruptedly-ethyl.ngrok-free.dev",
      "ngrok-free.dev",
      "*.ngrok-free.dev",
      "ngrok.io",
      "*.ngrok.io",
      "unmenially-dextrorotatory-micah.ngrok-free.dev"
    ],
  },
});
