import { test, expect } from "@playwright/test";
import { BoardPage } from "./page-objects/board.page";
import { HistoryPage } from "./page-objects/history.page";

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
