import { expect, test } from "@playwright/test";

test("página inicial mostra o nome do app", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Synap");
  await expect(page.getByRole("heading", { level: 1, name: "Synap" })).toBeVisible();
});
