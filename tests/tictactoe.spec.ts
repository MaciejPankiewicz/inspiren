import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");
  await page.locator(".board-row .square").nth(0).click();
  await page.locator(".board-row .square").nth(3).click();
  await page.locator(".board-row .square").nth(2).click();
  await page.locator(".board-row .square").nth(4).click();
  await expect(page.locator(".board-row .square").nth(0)).toHaveText("X");
});
