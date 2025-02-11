import { Locator, Page } from "@playwright/test";

export class BoardPage {
  firstSquare: Locator;
  secondSquare: Locator;
  thirdSquare: Locator;
  fourthSquare: Locator;
  fifthSquare: Locator;
  sixthSquare: Locator;
  seventhSquare: Locator;
  eighthSquare: Locator;
  ninthSquare: Locator;
  gameStatusText: Locator;
  gameResetButton: Locator;
  constructor(private page: Page) {
    this.firstSquare = page.locator(".board-row .square").nth(0);
    this.secondSquare = page.locator(".board-row .square").nth(1);
    this.thirdSquare = page.locator(".board-row .square").nth(2);
    this.fourthSquare = page.locator(".board-row .square").nth(3);
    this.fifthSquare = page.locator(".board-row .square").nth(4);
    this.sixthSquare = page.locator(".board-row .square").nth(5);
    this.seventhSquare = page.locator(".board-row .square").nth(6);
    this.eighthSquare = page.locator(".board-row .square").nth(7);
    this.ninthSquare = page.locator(".board-row .square").nth(8);
    this.gameStatusText = page.locator(".status");
    this.gameResetButton = page.locator(".reset-wrapper");
  }

  async playerXwinsByRow(): Promise<void> {
    await this.firstSquare.click();
    await this.fourthSquare.click();
    await this.secondSquare.click();
    await this.fifthSquare.click();
    await this.thirdSquare.click();
  }
  async playerXwinsByColumn() {
    await this.firstSquare.click();
    await this.secondSquare.click();
    await this.fourthSquare.click();
    await this.fifthSquare.click();
    await this.seventhSquare.click();
  }
  async playerXwinsByDiag() {
    await this.firstSquare.click();
    await this.secondSquare.click();
    await this.fifthSquare.click();
    await this.sixthSquare.click();
    await this.ninthSquare.click();
  }
  // async playerOwinsByRow() {
  // }
  // async playerOwinsByColumn() {
  // }
  // async playerOwinsByDiag() {
  // }
}
