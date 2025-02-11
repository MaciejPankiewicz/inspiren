import { Locator, Page } from "@playwright/test";

export class HistoryPage {
  goToGameStartButton: Locator;
  goToMoveButton: Locator;
  turnHistoryLabelText: Locator;
  gotoMoveButton8: Locator;
  constructor(private page: Page) {
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
