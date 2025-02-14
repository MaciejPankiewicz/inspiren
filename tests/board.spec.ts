import { test as base } from "@playwright/test";
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
    await boardPage.playMoves([
      [1, 1], // X
      [2, 1], // O
      [1, 2], // X
      [2, 2], // O
      [1, 3], // X wins
    ]);
    // ASSERT - check if the game status text is correct
    await boardPage.assertGameStatus("Winner: X");
  });

  test("Check win message when Player X wins by column", async ({
    boardPage,
  }) => {
    // ACT - set up the board to win by column
    await boardPage.playMoves([
      [1, 1], // X
      [1, 2], // O
      [2, 1], // X
      [1, 3], // O
      [3, 1], // X wins
    ]);
    // ASSERT - check if the game status text is correct
    await boardPage.assertGameStatus("Winner: X");
  });

  test("Check win message when Player X wins by diagonal", async ({
    boardPage,
  }) => {
    // ACT - set up the board to win by diagonal
    await boardPage.playMoves([
      [1, 1], // X
      [1, 2], // O
      [2, 2], // X
      [1, 3], // O
      [3, 3], // X wins
    ]);
    // ASSERT - check if the game status text is correct
    await boardPage.assertGameStatus("Winner: X");
  });
});

test.describe("Game Functionality - Player O Wins", () => {
  test("Check win message when Player O wins by row", async ({ boardPage }) => {
    // ACT - set up the board to win by row
    await boardPage.playMoves([
      [2, 1], // X
      [1, 1], // O
      [2, 2], // X
      [1, 2], // O
      [3, 1], // X
      [1, 3], // O wins
    ]);
    // ASSERT - check if the game status text is correct
    await boardPage.assertGameStatus("Winner: O");
  });

  test("Check win message when Player O wins by column", async ({
    boardPage,
  }) => {
    // ACT - set up the board to win by column
    await boardPage.playMoves([
      [1, 2], // X
      [1, 1], // O
      [1, 3], // X
      [2, 1], // O
      [3, 2], // X
      [3, 1], // O wins
    ]);
    // ASSERT - check if the game status text is correct
    await boardPage.assertGameStatus("Winner: O");
  });

  test("Check win message when Player O wins by diagonal", async ({
    boardPage,
  }) => {
    // ACT - set up the board to win by diagonal
    await boardPage.playMoves([
      [1, 2], // X
      [1, 1], // O
      [1, 3], // X
      [2, 2], // O
      [3, 1], // X
      [3, 3], // O wins
    ]);
    // ASSERT -  check if the game status text is correct
    await boardPage.assertGameStatus("Winner: O");
  });
});

test.describe("Game Functionality - Draw Scenario", () => {
  test("Check if the game properly recognizes a draw after all moves", async ({
    boardPage,
  }) => {
    // WARNING!!!! FAILING TEST - fail due to missing DRAW message/functionality.

    // ACT - set up the board to draw
    await boardPage.playMoves([
      [1, 1], // X
      [1, 2], // O
      [1, 3], // X
      [2, 1], // O
      [2, 3], // X
      [2, 2], // O
      [3, 1], // X
      [3, 3], // O
      [3, 2], // X - DRAW
    ]);
    // ASSERT - check if the game status text is correct
    await boardPage.assertGameStatus("Draw");
  });
  test("Check if the game correctly handles an almost-draw scenario", async ({
    boardPage,
  }) => {
    // ACT - set up the board to almost draw
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
    // ASSERT - check if the game status text is correct
    await boardPage.assertGameStatus("Next player: X");
  });
});

test.describe("Game Functionality - Field Selection", () => {
  test("Check if players are prevented from selecting taken fields", async ({
    boardPage,
  }) => {
    // ACT - make a move
    await boardPage.clickAndAssertSquare(1, 1, "X");
    // ASSERT - check if the field is marked
    await boardPage.clickAndAssertSquare(1, 1, "X");
    // ACT - make a move on another field
    await boardPage.clickAndAssertSquare(1, 2, "O");
  });
  test("Check if players can select fields after a game-winning move", async ({
    boardPage,
  }) => {
    // ACT - set up the board to win by row and then make a move
    await boardPage.playMoves([
      [1, 1], // X
      [2, 1], // O
      [1, 2], // X
      [2, 2], // O
      [1, 3], // X wins
    ]);
    await boardPage.clickAndAssertSquare(2, 3, "");
  });
});

test.describe("Game Functionality - Reset Button and Player Turn Display", () => {
  test("Check if the Reset button works after a player marks a square and if turn display updates correctly after it", async ({
    boardPage,
  }) => {
    // ASSERT - check if the game status text is correct
    await boardPage.assertGameStatus("Next player: X");
    // ACT - make a move
    await boardPage.clickAndAssertSquare(1, 1, "X");
    // ASSERT - check if the game status text is correct
    await boardPage.assertGameStatus("Next player: O");
    await boardPage.clickAndAssertSquare(1, 2, "O");
    // ACT -  make another move
    await boardPage.clickAndAssertSquare(1, 3, "X");
    // ASSERT - check if the game status text is correct
    await boardPage.assertGameStatus("Next player: O");
    await boardPage.resetGame();
    // ASSERT - Verify no selected squares are present on the gameboard
    await boardPage.checkEachRowForSelectedSquares();
    // ASSERT - check if the game status text is correct
    await boardPage.assertGameStatus("Next player: X");
  });
  test("Check if Reset clears marked squares and restores player turn order", async ({
    boardPage,
  }) => {
    // ACT - set up the board to almost draw and then reset the game
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
    await boardPage.resetGame();
    // ASSERT - Verify no selected squares are present on the gameboard
    await boardPage.checkEachRowForSelectedSquares();
    // ASSERT - check if the game status text is correct
    await boardPage.assertGameStatus("Next player: X");
  });
  test("Check if Reset button works after a win and if it resets turn display", async ({
    boardPage,
  }) => {
    // ACT - set up the board to win by row
    await boardPage.playMoves([
      [1, 1], // X
      [2, 1], // O
      [1, 2], // X
      [2, 2], // O
      [1, 3], // X wins
    ]);
    // ASSERT - check if the game status text is correct
    await boardPage.assertGameStatus("Winner: X");
    // ACT - reset the game
    await boardPage.resetGame();
    // ASSERT - Verify no selected squares are present on the gameboard
    await boardPage.checkEachRowForSelectedSquares();
    // ASSERT - check if the game status text is correct
    await boardPage.assertGameStatus("Next player: X");
  });
});
