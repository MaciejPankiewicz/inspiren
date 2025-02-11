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
    await expect(historyPage.turnHistoryLabelText).toBeVisible();
    await expect(historyPage.goToGameStartButton).toBeVisible();
    await boardPage.firstSquare.click();
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: O");
    await historyPage.goToGameStartButton.click();
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: X");
    await boardPage.checkEachRowForSelectedSquares();
  });
  test("Check if Turn History reacts to player moves ", async ({
    boardPage,
    historyPage,
  }) => {
    await expect(historyPage.goToGameStartButton).toBeVisible();
    await boardPage.firstSquare.click();
    expect(await historyPage.goToMoveButton.count()).toBe(1);
    await boardPage.secondSquare.click();
    expect(await historyPage.goToMoveButton.count()).toBe(2);
    await historyPage.goToGameStartButton.click();
    await boardPage.firstSquare.click();
    expect(await historyPage.goToMoveButton.count()).toBe(1);
    await boardPage.resetGame();
    expect(await historyPage.goToMoveButton.count()).toBe(0);
  });

  test("Verify Turn History updates Gameboard correctly ", async ({
    historyPage,
    boardPage,
  }) => {
    await boardPage.playersAlmostDrawByAllMoves();
    await historyPage.gotoMoveButton8.click();
    expect(await boardPage.gameStatusText.innerText()).toBe("Next player: O");
    await expect(boardPage.ninthSquare).toHaveText("");
  });
});
