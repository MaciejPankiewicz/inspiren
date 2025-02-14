import { expect, Locator, Page } from "@playwright/test";

export class HistoryPage {
  readonly goToGameStartButton: Locator;
  readonly turnHistoryLabelText: Locator;
  constructor(private page: Page) {
    this.goToGameStartButton = page.getByRole("button", {
      name: "Go to game start",
    });
    this.turnHistoryLabelText = page.getByText("History");
  }

  getGoToMoveButton(moveNumber: number): Locator {
    return this.page.locator("li:nth-child(" + (moveNumber + 1) + ") > button");
  }

  assertHistoryButtonVisibility(moveNumber: number): Promise<void> {
    return expect(this.getGoToMoveButton(moveNumber)).toBeVisible();
  }
}
