import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    include: ["src/**/*.{ts,tsx}"],
    passWithNoTests: true,
    environment: "jsdom",
  },
  plugins: [tsconfigPaths()],
});
