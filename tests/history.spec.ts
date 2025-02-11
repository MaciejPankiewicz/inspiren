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

test.describe("Check history of turns", () => {
  test("Check if Go to game start button works ", async ({
    boardPage,
    historyPage,
  }) => {
    // ASSERT
    await expect(historyPage.turnHistoryLabelText).toBeVisible();
    await expect(historyPage.goToGameStartButton).toBeVisible();
    // ACT
    await boardPage.firstSquare.click();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: O");
    // ACT
    await historyPage.goToGameStartButton.click();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: X");
    await boardPage.checkEachRowForSelectedSquares();
  });
  test("Check if Turn History reacts to player moves ", async ({
    boardPage,
    historyPage,
  }) => {
    // ASSERT
    await expect(historyPage.goToGameStartButton).toBeVisible();
    // ACT
    await boardPage.firstSquare.click();
    // ASSERT
    expect(await historyPage.goToMoveButton.count()).toBe(1);
    // ACT
    await boardPage.secondSquare.click();
    // ASSERT
    expect(await historyPage.goToMoveButton.count()).toBe(2);
    // ACT
    await historyPage.goToGameStartButton.click();
    await boardPage.firstSquare.click();
    // ASSERT
    expect(await historyPage.goToMoveButton.count()).toBe(1);
    await boardPage.resetGame();
    // ASSERT
    expect(await historyPage.goToMoveButton.count()).toBe(0);
  });

  test("Verify Turn History updates Gameboard correctly ", async ({
    historyPage,
    boardPage,
  }) => {
    // ACT
    await boardPage.playersAlmostDrawByAllMoves();
    await historyPage.gotoMoveButton8.click();
    // ASSERT
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: O");
    await expect(boardPage.ninthSquare).toHaveText("");
  });
});
