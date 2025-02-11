# Tic Tac Toe

## Task Description

This is a simple Tic Tac Toe game built with React.

Your task is to cover it with tests using Playwright.

### Game rules

- The game is played on a grid that's 3 squares by 3 squares.
- You are X, your friend is O. Players take turns putting their marks in empty squares.
- The first player to get 3 of their marks in a row (up, down, across, or diagonally) is the winner.
- When all 9 squares are full, the game is over. If no player has 3 marks in a row, the game ends in a draw.
- You can restart the game at any time.
- The game should display the winner or a draw message when the game is over.
- The game should display the current player's turn.
- The game should display the history of the turns.
- The game should allow you to go back to any previous turn.

## Installation

Install dependencies:

```sh
npm install
```

## Usage

To run the project:

```sh
npm run dev

```

## Automatic tests

Install playwright if needed:

```sh
npm init playwright@latest
```

Test run:

- To run all test

```sh
npx playwright test --workers=1
```

- To run selected test file

```sh
npx playwright test tests/board.spec.ts --workers=1
```

- To run UI mode

```sh
npx playwright test tests/board.spec.ts --ui --workers=1
```
