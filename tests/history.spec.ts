import { test as base, expect } from "@playwright/test";
import { BoardPage } from "./page-objects/board.page";
import { HistoryPage } from "./page-objects/history.page";

interface TestFixtures {
  boardPage: BoardPage;
  historyPage: HistoryPage;
}

const test = base.extend<TestFixtures>({
  boardPage: async ({ page }, run) => {
    await run(new BoardPage(page));
  },
  historyPage: async ({ page }, run) => {
    await run(new HistoryPage(page));
  },
});

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Turn History Functionality", () => {
  test("Check if the 'Go to game start' button resets the game state", async ({
    boardPage,
    historyPage,
  }) => {
    // ASSERT - check visibility of elements
    await expect(historyPage.turnHistoryLabelText).toBeVisible();
    await expect(historyPage.goToGameStartButton).toBeVisible();
    // ACT - make a move
    await boardPage.clickAndAssertSquare(1, 1, "X");
    // ASSERT - check player turn display
    await boardPage.assertGameStatus("Next player: O");
    // ACT - use Go to game start button
    await historyPage.goToGameStartButton.click();
    // ASSERT - check if turn display and game state is reset
    await boardPage.assertGameStatus("Next player: X");
    await boardPage.checkEachRowForSelectedSquares();
  });
  test("Check if Turn History reflects player moves", async ({
    boardPage,
    historyPage,
    page,
  }) => {
    // ASSERT - check visibility of elements
    await expect(historyPage.goToGameStartButton).toBeVisible();
    // ACT - make a move
    await boardPage.clickAndAssertSquare(1, 1, "X");
    // ASSERT - Verify the number of "Go to move" buttons displayed
    await historyPage.assertHistoryButtonVisibility(1);
    // ACT - make another move
    await boardPage.clickAndAssertSquare(1, 2, "O");
    // ASSERT - Verify the number of "Go to move" buttons displayed
    await historyPage.assertHistoryButtonVisibility(2);
    // ACT - use Go to Game Start button and then make a move
    await historyPage.goToGameStartButton.click();
    await boardPage.clickAndAssertSquare(1, 1, "X");
    // ASSERT - Verify the number of "Go to move" buttons displayed
    await historyPage.assertHistoryButtonVisibility(1);
    // ACT - Use Game Reset button
    await boardPage.resetGame();
    await page.waitForTimeout(1000);
    // ASSERT - Verify the number of "Go to move" buttons displayed
    await expect(historyPage.getGoToMoveButton(1)).not.toBeVisible();
  });

  test("Check if selecting a move in Turn History updates the Gameboard accurately", async ({
    historyPage,
    boardPage,
  }) => {
    // ACT - set the gameboard to a specific state and then click on a move in Turn History
    await boardPage.playMoves([
      [1, 1], // X
      [1, 2], // O
      [1, 3], // X
      [2, 1], // O
      [2, 3], // X
      [2, 2], // O
      [3, 1], // X
      [3, 3], // O - Almost draw
    ]);
    await historyPage.getGoToMoveButton(7).click();
    // ASSERT - check if the gameboard is updated correctly
    await boardPage.assertGameStatus("Next player: O");
    await boardPage.assertSquare(3, 3, "");
  });
});
