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
    await boardPage.firstSquare.click();
    // ASSERT - check player turn display
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: O");
    // ACT - use Go to game start button
    await historyPage.goToGameStartButton.click();
    // ASSERT - check if turn display and game state is reset
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: X");
    await boardPage.checkEachRowForSelectedSquares();
  });
  test("Check if Turn History reflects player moves", async ({
    boardPage,
    historyPage,
  }) => {
    // ASSERT - check visibility of elements
    await expect(historyPage.goToGameStartButton).toBeVisible();
    // ACT - make a move
    await boardPage.firstSquare.click();
    // ASSERT - Verify the number of "Go to move" buttons displayed
    expect(await historyPage.goToMoveButton.count()).toBe(1);
    // ACT - make another move
    await boardPage.secondSquare.click();
    // ASSERT - Verify the number of "Go to move" buttons displayed
    expect(await historyPage.goToMoveButton.count()).toBe(2);
    // ACT - use Go to Game Start button and then make a move
    await historyPage.goToGameStartButton.click();
    await boardPage.firstSquare.click();
    // ASSERT - Verify the number of "Go to move" buttons displayed
    expect(await historyPage.goToMoveButton.count()).toBe(1);
    // ACT - use Game Reset button
    await boardPage.resetGame();
    // ASSERT - Verify the number of "Go to move" buttons displayed
    expect(await historyPage.goToMoveButton.count()).toBe(0);
  });

  test("Check if selecting a move in Turn History updates the Gameboard accurately", async ({
    historyPage,
    boardPage,
  }) => {
    // ACT - set the gameboard to a specific state and then click on a move in Turn History
    await boardPage.playersAlmostDrawByAllMoves();
    await historyPage.gotoMoveButton8.click();
    // ASSERT - check if the gameboard is updated correctly
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: O");
    await expect(boardPage.ninthSquare).toHaveText("");
  });
});
