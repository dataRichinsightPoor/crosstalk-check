import {defineConfig} from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "ui.spec.mjs",
  use: {baseURL:"http://127.0.0.1:8766",viewport:{width:1440,height:1000},channel:"chromium"},
  webServer: {command:"python -m http.server 8766 --bind 127.0.0.1 --directory web",url:"http://127.0.0.1:8766",reuseExistingServer:!process.env.CI},
  reporter: "list"
});
