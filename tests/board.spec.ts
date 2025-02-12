import { test as base, expect } from "@playwright/test";
import { BoardPage } from "./page-objects/board.page";

interface TestFixtures {
  boardPage: BoardPage;
}

const test = base.extend<TestFixtures>({
  boardPage: async ({ page }, run) => {
    await run(new BoardPage(page));
  },
});

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Game Functionality - Player X Wins", () => {
  test("Check win message when Player X wins by row", async ({ boardPage }) => {
    // ACT - set up the board to win by row
    await boardPage.playerXwinsByRow();
    // ASSERT - check if the game status text is correct
    expect(await boardPage.gameStatusText.innerText()).toBe("Winner: X");
  });

  test("Check win message when Player X wins by column", async ({
    boardPage,
  }) => {
    // ACT - set up the board to win by column
    await boardPage.playerXwinsByColumn();
    // ASSERT - check if the game status text is correct
    expect(await boardPage.gameStatusText.innerText()).toBe("Winner: X");
  });

  test("Check win message when Player X wins by diagonal", async ({
    boardPage,
  }) => {
    // ACT - set up the board to win by diagonal
    await boardPage.playerXwinsByDiag();
    // ASSERT - check if the game status text is correct
    expect(await boardPage.gameStatusText.innerText()).toBe("Winner: X");
  });
});

test.describe("Game Functionality - Player O Wins", () => {
  test("Check win message when Player O wins by row", async ({ boardPage }) => {
    // ACT - set up the board to win by row
    await boardPage.playerOwinsByRow();
    // ASSERT - check if the game status text is correct
    expect(await boardPage.gameStatusText.innerText()).toBe("Winner: O");
  });

  test("Check win message when Player O wins by column", async ({
    boardPage,
  }) => {
    // ACT - set up the board to win by column
    await boardPage.playerOwinsByColumn();
    // ASSERT - check if the game status text is correct
    expect(await boardPage.gameStatusText.innerText()).toBe("Winner: O");
  });

  test("Check win message when Player O wins by diagonal", async ({
    boardPage,
  }) => {
    // ACT - set up the board to win by diagonal
    await boardPage.playerOwinsByDiag();
    // ASSERT -  check if the game status text is correct
    expect(await boardPage.gameStatusText.innerText()).toBe("Winner: O");
  });
});

test.describe("Game Functionality - Draw Scenario", () => {
  test("Check if the game properly recognizes a draw after all moves", async ({
    boardPage,
  }) => {
    // WARNING!!!! FAILING TEST - fail due to missing DRAW message/functionality.

    // ACT - set up the board to draw
    await boardPage.playersDrawByAllMoves();
    // ASSERT - check if the game status text is correct
    expect(await boardPage.gameStatusText.innerText()).toBe("Draw");
  });
  test("Check if the game correctly handles an almost-draw scenario", async ({
    boardPage,
  }) => {
    // ACT - set up the board to almost draw
    await boardPage.playersAlmostDrawByAllMoves();
    // ASSERT - check if the game status text is correct
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: X");
  });
});

test.describe("Game Functionality - Field Selection", () => {
  test("Check if players are prevented from selecting taken fields", async ({
    boardPage,
  }) => {
    // ACT - make a move
    await boardPage.firstSquare.click();
    // ASSERT - check if the field is marked
    await expect(boardPage.firstSquare).toHaveText("X");
    // ACT - try to make a move on the same field by another player
    await boardPage.firstSquare.click();
    // ASSERT - check if the field is still marked by a previouse player
    await expect(boardPage.firstSquare).toHaveText("X");
    // ACT - make a move on another field
    await boardPage.secondSquare.click();
    // ASSERT - check if the field is marked by the next player
    await expect(boardPage.secondSquare).toHaveText("O");
  });
  test("Check if players can select fields after a game-winning move", async ({
    boardPage,
  }) => {
    // ACT - set up the board to win by row and then make a move
    await boardPage.playerXwinsByRow();
    await boardPage.sixthSquare.click();
    // ASSERT - check if the field is marked by the next player
    await expect(boardPage.sixthSquare).toHaveText("");
  });
});

test.describe("Game Functionality - Reset Button and Player Turn Display", () => {
  test("Check if the Reset button works after a player marks a square and if turn display updates correctly after it", async ({
    boardPage,
  }) => {
    // ASSERT - check if the game status text is correct
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: X");
    // ACT - make a move
    await boardPage.firstSquare.click();
    // ASSERT - check if the game status text is correct
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: O");
    // ACT - make another move
    await boardPage.secondSquare.click();
    // ASSERT - check if the game status text is correct
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: X");
    // ACT -  make another move
    await boardPage.thirdSquare.click();
    // ASSERT - check if the game status text is correct
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: O");
    // ACT - reset the game
    await boardPage.resetGame();
    // ASSERT - Verify no selected squares are present on the gameboard
    await boardPage.checkEachRowForSelectedSquares();
    // ASSERT - check if the game status text is correct
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: X");
  });
  test("Check if Reset clears marked squares and restores player turn order", async ({
    boardPage,
  }) => {
    // ACT - set up the board to almost draw and then reset the game
    await boardPage.playersAlmostDrawByAllMoves();
    await boardPage.resetGame();
    // ASSERT - Verify no selected squares are present on the gameboard
    await boardPage.checkEachRowForSelectedSquares();
    // ASSERT - check if the game status text is correct
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: X");
  });
  test("Check if Reset button works after a win and if it resets turn display", async ({
    boardPage,
  }) => {
    // ACT - set up the board to win by row
    await boardPage.playerXwinsByRow();
    // ASSERT - check if the game status text is correct
    expect(await boardPage.gameStatusText.innerText()).toBe("Winner: X");
    // ACT - reset the game
    await boardPage.resetGame();
    // ASSERT - Verify no selected squares are present on the gameboard
    await boardPage.checkEachRowForSelectedSquares();
    // ASSERT - check if the game status text is correct
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: X");
  });
});
