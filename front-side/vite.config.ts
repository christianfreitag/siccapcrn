import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import {resolve} from 'path'
// https://vitejs.dev/config/

const root = resolve(__dirname,'./')
export default defineConfig({
  root,
  plugins: [react()],
});
