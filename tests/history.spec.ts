import { test, expect } from "@playwright/test";
import { BoardPage } from "./page-objects/board.page";
import { HistoryPage } from "./page-objects/history.page";

test.describe("Check history of turns", () => {
  test("Check if Go to game start button works ", async ({ page }) => {
    // ARRANGE
    const newHistory = new HistoryPage(page);
    const newBoard = new BoardPage(page);
    await expect(newHistory.turnHistoryLabelText).toBeVisible();
    await expect(newHistory.goToGameStartButton).toBeVisible();
    await newBoard.firstSquare.click();
    expect(await newBoard.gameStatusText.innerText()).toBe("Next player: O");
    await newHistory.goToGameStartButton.click();
    expect(await newBoard.gameStatusText.innerText()).toBe("Next player: X");
    await newBoard.checkEachRowForSelectedSquares();
  });
  test("Check if Turn History reacts to player moves ", async ({ page }) => {
    // ARRANGE
    const newHistory = new HistoryPage(page);
    const newBoard = new BoardPage(page);

    await expect(newHistory.goToGameStartButton).toBeVisible();
    await newBoard.firstSquare.click();
    expect(await newHistory.goToMoveButton.count()).toBe(1);
    await newBoard.secondSquare.click();
    expect(await newHistory.goToMoveButton.count()).toBe(2);
    await newHistory.goToGameStartButton.click();
    await newBoard.firstSquare.click();
    expect(await newHistory.goToMoveButton.count()).toBe(1);
    await newBoard.resetGame();
    expect(await newHistory.goToMoveButton.count()).toBe(0);
  });

  test("Verify Turn History updates Gameboard correctly ", async ({ page }) => {
    // ARRANGE
    const newHistory = new HistoryPage(page);
    const newBoard = new BoardPage(page);

    await newBoard.playersAlmostDrawByAllMoves();
    await newHistory.gotoMoveButton8.click();
    expect(await newBoard.gameStatusText.innerText()).toBe("Next player: O");
    await expect(newBoard.ninthSquare).toHaveText("");
  });
});

// ADD BUG REPORT FOR MISSING DRAW MESSAGE
// add ui improvements text color, add numer/whose turn it was to turn history, history label could be bigger, after 1st move and adding of history, board move to the left
