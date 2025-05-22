import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./", // this is good for shared hosting
  plugins: [react()],
});
