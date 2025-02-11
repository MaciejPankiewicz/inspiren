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
    // FAILING TEST - failes due to missing DRAW message/functionality.

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
  test("Check if reset button works after player marks the square and if player turn display works", async ({
    boardPage,
  }) => {
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: X");
    await boardPage.firstSquare.click();
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: O");
    await boardPage.secondSquare.click();
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: X");
    await boardPage.thirdSquare.click();
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: O");
    await boardPage.resetGame();
    await boardPage.checkEachRowForSelectedSquares();
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: X");
  });
  test("Check if reset button works after players marks several squares and if player turn display resets", async ({
    boardPage,
  }) => {
    await boardPage.playersAlmostDrawByAllMoves();
    await boardPage.resetGame();
    await boardPage.checkEachRowForSelectedSquares();
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: X");
  });
  test("Check if reset button works after player wins and if player turn display resets", async ({
    boardPage,
  }) => {
    await boardPage.playerXwinsByRow();
    expect(await boardPage.gameStatusText.innerText()).toBe("Winner: X");
    await boardPage.resetGame();
    await boardPage.checkEachRowForSelectedSquares();
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: X");
  });
});
