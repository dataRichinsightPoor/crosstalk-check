import {test,expect} from "@playwright/test";
import fs from "node:fs";
const cases=JSON.parse(fs.readFileSync(new URL("../web/cases.json",import.meta.url)));
test.beforeEach(async({page})=>{
  await page.goto("/");
  await expect(page.locator("#run-status")).toContainText("checks passed");
});
test("all 18 systems load and retain evidence boundaries",async({page})=>{
  for(const c of cases){
    await page.locator(`[data-case="${c.id}"]`).click();
    await expect(page.locator("#case-title")).toHaveText(c.title);
    await expect(page.locator("#run-status")).toContainText("checks passed");
    await page.getByRole("tab",{name:"Evidence & limits"}).click();
    await expect(page.locator("#view-evidence")).toContainText(c.omissions);
    await page.getByRole("tab",{name:"Stimulation lab"}).click();
    await expect(page.locator("#main-chart svg")).toHaveCount(1);
  }
});
test("gate, sequence, readout, invalid-input recovery",async({page})=>{
  await page.locator("#sequence").selectOption("A then B");
  await page.locator("#gate-mode").selectOption("hub");
  await page.locator("#readout").selectOption("reporter");
  await expect(page.locator("#run-status")).toContainText("checks passed");
  await page.locator("#a-end").fill("1");await page.locator("#a-end").blur();
  await expect(page.locator("#error")).toBeVisible();
  await page.locator("#a-end").fill("10");await page.locator("#a-end").blur();
  await expect(page.locator("#error")).toBeHidden();
  await expect(page.locator("#run-status")).toContainText("checks passed");
});
test("filter empty state and restore",async({page})=>{
  await page.locator("#search").fill("no-such-receptor");
  await expect(page.locator("#case-list")).toContainText("No systems match");
  await page.locator("#search").fill("");
  await page.locator("#family").selectOption("Cytokine receptors");
  await expect(page.locator(".case-button")).toHaveCount(3);
});
test("sweep and export are real downloads",async({page})=>{
  const [csv]=await Promise.all([page.waitForEvent("download"),page.locator("#csv").click()]);
  expect(csv.suggestedFilename()).toMatch(/\.csv$/);
  await page.getByRole("tab",{name:"Gate sensitivity"}).click();
  await page.locator("#run-sweep").click();
  await expect(page.locator(".sweep-table tbody td")).toHaveCount(25);
  const [sweep]=await Promise.all([page.waitForEvent("download"),page.locator("#sweep-csv").click()]);
  expect(sweep.suggestedFilename()).toContain("sweep");
});
test("mobile and resize preserve visible flow",async({page})=>{
  await page.setViewportSize({width:375,height:812});
  await expect(page.locator("#case-title")).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
  expect(overflow).toBe(false);
  await page.locator("#sequence").selectOption("Pulsed A");
  await expect(page.locator("#run-status")).toContainText("checks passed");
  await page.setViewportSize({width:1440,height:1000});
  await expect(page.locator("#main-chart svg")).toBeVisible();
});
test("bioassay plan, capacity failure, recovery, and export",async({page})=>{
  await page.getByRole("tab",{name:"Assay design"}).click();
  await expect(page.locator("#assay-guidance")).toContainText("Required matched conditions");
  await page.locator("#make-plate").click();
  await expect(page.locator(".plate-grid tbody td")).toHaveCount(96);
  await expect(page.locator("#plate-result")).toContainText("36 assigned wells");
  const [file]=await Promise.all([page.waitForEvent("download"),page.locator("#plate-csv").click()]);
  expect(file.suggestedFilename()).toContain("cclxvii-99problems-08");
  await page.locator("#plate-replicates").fill("6");await page.locator("#make-plate").click();
  await expect(page.locator("#plate-error")).toBeVisible();
  await page.locator("#plate-replicates").fill("3");await page.locator("#make-plate").click();
  await expect(page.locator("#plate-error")).toBeHidden();
});
