import { expect, Locator, Page } from "@playwright/test";

export class BoardPage {
  readonly gameStatusText: Locator;
  readonly gameResetButton: Locator;
  readonly gameRows: Locator;
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
    this.gameStatusText = page.locator(".status");
    this.gameResetButton = page.locator(".reset-wrapper");
    this.gameRows = page.locator(".board-row");
  }

  async assertGameStatus(expectedText: string): Promise<void> {
    await expect(this.gameStatusText).toHaveText(expectedText);
  }

  async playMoves(moves: [number, number][]): Promise<void> {
    for (const [row, col] of moves) {
      await (await this.getSquare(row, col)).click();
    }
  }

  async getSquare(row: number, col: number): Promise<Locator> {
    const rowLocator = this.page.locator(".board-row").nth(row - 1);
    return rowLocator.locator(".square").nth(col - 1);
  }
  async assertSquare(
    row: number,
    col: number,
    expectedValue: string
  ): Promise<void> {
    const square = await this.getSquare(row, col);
    await expect(square).toHaveText(expectedValue);
  }
  async clickAndAssertSquare(
    row: number,
    col: number,
    expectedValue: string
  ): Promise<void> {
    const square = await this.getSquare(row, col);
    await square.click();
    await expect(square).toHaveText(expectedValue);
  }
  async resetGame(): Promise<void> {
    await this.gameResetButton.click();
  }

  async checkEachRowForSelectedSquares(): Promise<void> {
    const rows = await this.gameRows.all();

    for (const row of rows) {
      await expect(row).not.toHaveText(/X|O/);
    }
  }
}
