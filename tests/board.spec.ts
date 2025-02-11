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

test.describe("Check if the game is working properly when Player X wins", () => {
  test("Check message when Player X wins by row", async ({ boardPage }) => {
    // ACT
    await boardPage.playerXwinsByRow();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Winner: X");
  });

  test("Check message when Player X wins by column", async ({ boardPage }) => {
    // ACT
    await boardPage.playerXwinsByColumn();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Winner: X");
  });

  test("Check message when Player X wins by diagonal", async ({
    boardPage,
  }) => {
    // ACT
    await boardPage.playerXwinsByDiag();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Winner: X");
  });
});

test.describe("Check if the game is working properly when Player O wins", () => {
  test("Check message when Player O wins by row", async ({ boardPage }) => {
    // ACT
    await boardPage.playerOwinsByRow();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Winner: O");
  });

  test("Check message when Player O wins by column", async ({ boardPage }) => {
    // ACT
    await boardPage.playerOwinsByColumn();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Winner: O");
  });

  test("Check message when Player O wins by diagonal", async ({
    boardPage,
  }) => {
    // ACT
    await boardPage.playerOwinsByDiag();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Winner: O");
  });
});

test.describe("Check if the game is working properly when Players draw", () => {
  test("Check if the game is working properly when Players draw by using all moves", async ({
    boardPage,
  }) => {
    // WARNING!!!! FAILING TEST - fail due to missing DRAW message/functionality.

    // ACT
    await boardPage.playersDrawByAllMoves();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Draw");
  });
  test("Check if the game is working properly when Players almost draw by using all moves", async ({
    boardPage,
  }) => {
    // ACT
    await boardPage.playersAlmostDrawByAllMoves();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: X");
  });
});

test.describe("Check how app reacts to selecting fields", () => {
  test("Check if players can select already selected fields", async ({
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
  test("Check if players can select fields after game ended in Win", async ({
    boardPage,
  }) => {
    // ACT
    await boardPage.playerXwinsByRow();
    await boardPage.sixthSquare.click();
    // ASSERT
    await expect(boardPage.sixthSquare).toHaveText("");
  });
});
test.describe("Check RESET button funcionality and display of next Player", () => {
  test("Check if reset button works after player marks the square and if player turn display works", async ({
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
  test("Check if reset button works after players marks several squares and if player turn display resets", async ({
    boardPage,
  }) => {
    // ACT
    await boardPage.playersAlmostDrawByAllMoves();
    await boardPage.resetGame();
    // ASSERT
    await boardPage.checkEachRowForSelectedSquares();
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: X");
  });
  test("Check if reset button works after player wins and if player turn display resets", async ({
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
