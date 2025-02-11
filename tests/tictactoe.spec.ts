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
test.describe("Check if the game is working properly when Players draw", () => {
  test("Check if the game is working properly when Players draw by using all moves", async ({
    page,
  }) => {
    // FAILING TEST - failes due to missing DRAW message/functionality.
    // ARRANGE
    const newBoard = new BoardPage(page);
    // ACT
    await newBoard.playersDrawByAllMoves();
    // ASSERT
    expect(await newBoard.gameStatusText.innerText()).toBe("Draw");
  });
  test("Check if the game is working properly when Players almost draw by using all moves", async ({
    page,
  }) => {
    // ARRANGE
    const newBoard = new BoardPage(page);
    // ACT
    await newBoard.playersAlmostDrawByAllMoves();
    // ASSERT
    expect(await newBoard.gameStatusText.innerText()).toBe("Next player: X");
  });
});

test.describe("Check how app reacts to selecting fields", () => {
  test("Check if players can select already selected fields", async ({
    page,
  }) => {
    // ARRANGE
    const newBoard = new BoardPage(page);

    await newBoard.firstSquare.click();
    await expect(newBoard.firstSquare).toHaveText("X");
    await newBoard.firstSquare.click();
    await expect(newBoard.firstSquare).toHaveText("X");
    await newBoard.secondSquare.click();
    await expect(newBoard.secondSquare).toHaveText("O");
  });
  test("Check if players can select fields after game ended in Win", async ({
    page,
  }) => {
    // ARRANGE
    const newBoard = new BoardPage(page);

    await newBoard.playerXwinsByRow();
    await newBoard.sixthSquare.click();
    await expect(newBoard.sixthSquare).toHaveText("");
  });
});
test.describe("Check RESET button funcionality and display of next Player", () => {
  test("Check if reset button works after player marks the square and if player turn works", async ({
    page,
  }) => {
    // ARRANGE
    const newBoard = new BoardPage(page);

    expect(await newBoard.gameStatusText.innerText()).toBe("Next player: X");
    await newBoard.firstSquare.click();
    expect(await newBoard.gameStatusText.innerText()).toBe("Next player: O");
    await newBoard.secondSquare.click();
    expect(await newBoard.gameStatusText.innerText()).toBe("Next player: X");
    await newBoard.thirdSquare.click();
    expect(await newBoard.gameStatusText.innerText()).toBe("Next player: O");
    await newBoard.resetGame();
    await newBoard.checkEachRowForSelectedSquares();
    expect(await newBoard.gameStatusText.innerText()).toBe("Next player: X");
  });
  test("Check if reset button works after players marks several squares and if player turn resets", async ({
    page,
  }) => {
    // ARRANGE
    const newBoard = new BoardPage(page);

    await newBoard.playersAlmostDrawByAllMoves();
    await newBoard.resetGame();
    await newBoard.checkEachRowForSelectedSquares();
    expect(await newBoard.gameStatusText.innerText()).toBe("Next player: X");
  });
  test("Check if reset button works after player wins and if player turn resets", async ({
    page,
  }) => {
    // ARRANGE
    const newBoard = new BoardPage(page);

    await newBoard.playerXwinsByRow();
    expect(await newBoard.gameStatusText.innerText()).toBe("Winner: X");
    await newBoard.resetGame();
    await newBoard.checkEachRowForSelectedSquares();
    expect(await newBoard.gameStatusText.innerText()).toBe("Next player: X");
  });
});

// check history of the turns
// check if possible to go back to any previous turn
// go to game start from history
// ADD BUG REPORT FOR MISSING DRAW MESSAGE
// fix upstream
