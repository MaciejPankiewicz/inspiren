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
    // ACT
    await boardPage.playerXwinsByRow();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Winner: X");
  });

  test("Check win message when Player X wins by column", async ({
    boardPage,
  }) => {
    // ACT
    await boardPage.playerXwinsByColumn();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Winner: X");
  });

  test("Check win message when Player X wins by diagonal", async ({
    boardPage,
  }) => {
    // ACT
    await boardPage.playerXwinsByDiag();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Winner: X");
  });
});

test.describe("Game Functionality - Player O Wins", () => {
  test("Check win message when Player O wins by row", async ({ boardPage }) => {
    // ACT
    await boardPage.playerOwinsByRow();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Winner: O");
  });

  test("Check win message when Player O wins by column", async ({
    boardPage,
  }) => {
    // ACT
    await boardPage.playerOwinsByColumn();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Winner: O");
  });

  test("Check win message when Player O wins by diagonal", async ({
    boardPage,
  }) => {
    // ACT
    await boardPage.playerOwinsByDiag();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Winner: O");
  });
});

test.describe("Game Functionality - Draw Scenario", () => {
  test("Check if the game properly recognizes a draw after all moves", async ({
    boardPage,
  }) => {
    // WARNING!!!! FAILING TEST - fail due to missing DRAW message/functionality.

    // ACT
    await boardPage.playersDrawByAllMoves();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Draw");
  });
  test("Check if the game correctly handles an almost-draw scenario", async ({
    boardPage,
  }) => {
    // ACT
    await boardPage.playersAlmostDrawByAllMoves();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: X");
  });
});

test.describe("Game Functionality - Field Selection", () => {
  test("Check if players are prevented from selecting taken fields", async ({
    boardPage,
  }) => {
    // ACT
    await boardPage.firstSquare.click();
    // ASSERT
    await expect(boardPage.firstSquare).toHaveText("X");
    // ACT
    await boardPage.firstSquare.click();
    // ASSERT
    await expect(boardPage.firstSquare).toHaveText("X");
    // ACT
    await boardPage.secondSquare.click();
    // ASSERT
    await expect(boardPage.secondSquare).toHaveText("O");
  });
  test("Check if players can select fields after a game-winning move", async ({
    boardPage,
  }) => {
    // ACT
    await boardPage.playerXwinsByRow();
    await boardPage.sixthSquare.click();
    // ASSERT
    await expect(boardPage.sixthSquare).toHaveText("");
  });
});

test.describe("Game Functionality - Reset Button and Player Turn Display", () => {
  test("Check if the Reset button works after a player marks a square and if turn display updates correctly after it", async ({
    boardPage,
  }) => {
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: X");
    // ACT
    await boardPage.firstSquare.click();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: O");
    // ACT
    await boardPage.secondSquare.click();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: X");
    // ACT
    await boardPage.thirdSquare.click();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: O");
    // ACT
    await boardPage.resetGame();
    await boardPage.checkEachRowForSelectedSquares();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: X");
  });
  test("Check if Reset clears marked squares and restores player turn order", async ({
    boardPage,
  }) => {
    // ACT
    await boardPage.playersAlmostDrawByAllMoves();
    await boardPage.resetGame();
    // ASSERT
    await boardPage.checkEachRowForSelectedSquares();
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: X");
  });
  test("Check if Reset button works after a win and if it resets turn display", async ({
    boardPage,
  }) => {
    // ACT
    await boardPage.playerXwinsByRow();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Winner: X");
    // ACT
    await boardPage.resetGame();
    // ASSERT
    await boardPage.checkEachRowForSelectedSquares();
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: X");
  });
});
