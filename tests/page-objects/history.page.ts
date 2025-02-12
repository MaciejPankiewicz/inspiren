import { Locator, Page } from "@playwright/test";

export class HistoryPage {
  readonly goToGameStartButton: Locator;
  readonly goToMoveButton: Locator;
  readonly turnHistoryLabelText: Locator;
  readonly gotoMoveButton8: Locator;
  constructor(page: Page) {
    this.goToGameStartButton = page.getByRole("button", {
      name: "Go to game start",
    });
    this.goToMoveButton = page.getByRole("button", {
      name: "Go to move # move",
    });
    this.turnHistoryLabelText = page.getByText("History");

    this.gotoMoveButton8 = page.locator("li:nth-child(8) > button");
  }
}
