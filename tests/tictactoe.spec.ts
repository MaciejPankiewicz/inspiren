import { test, expect } from "@playwright/test";
import { BoardPage } from "./page-objects/board.page";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Check if the game is working properly when Player X wins", () => {
  test("Check message when Player X wins by row", async ({ page }) => {
    // ARRANGE
    const newBoard = new BoardPage(page);
    // ACT
    await newBoard.playerXwinsByRow();
    // ASSERT
    expect(await newBoard.gameStatusText.innerText()).toBe("Winner: X");
  });

  test("Check message when Player X wins by column", async ({ page }) => {
    // ARRANGE
    const newBoard = new BoardPage(page);
    // ACT
    await newBoard.playerXwinsByColumn();
    // ASSERT
    expect(await newBoard.gameStatusText.innerText()).toBe("Winner: X");
  });

  test("Check message when Player X wins by diagonal", async ({ page }) => {
    // ARRANGE
    const newBoard = new BoardPage(page);
    // ACT
    await newBoard.playerXwinsByDiag();
    // ASSERT
    expect(await newBoard.gameStatusText.innerText()).toBe("Winner: X");
  });
});
test.describe("Check if the game is working properly when Player O wins", () => {
  test("Check message when Player O wins by row", async ({ page }) => {
    // ARRANGE
    const newBoard = new BoardPage(page);
    // ACT
    await newBoard.playerOwinsByRow();
    // ASSERT
    expect(await newBoard.gameStatusText.innerText()).toBe("Winner: O");
  });

  test("Check message when Player O wins by column", async ({ page }) => {
    // ARRANGE
    const newBoard = new BoardPage(page);
    // ACT
    await newBoard.playerOwinsByColumn();
    // ASSERT
    expect(await newBoard.gameStatusText.innerText()).toBe("Winner: O");
  });

  test("Check message when Player O wins by diagonal", async ({ page }) => {
    // ARRANGE
    const newBoard = new BoardPage(page);
    // ACT
    await newBoard.playerOwinsByDiag();
    // ASSERT
    expect(await newBoard.gameStatusText.innerText()).toBe("Winner: O");
  });
});

// PLayer 0 wins - check the message
// player wins by row
// player wins by column
// player wins diagonally
// draw by all fields - check the message
// Check if possible to select selected field
// Check if possible to check field after game is finished
// check current player turn
// check reset button in couple scenarios
// check history of the turns
// check if possible to go back to any previous turn
// go to game start from history
