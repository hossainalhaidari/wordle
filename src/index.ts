import { readFileSync } from "fs";
import prompts from "prompts";

const words = readFileSync("words.txt", "utf-8").split("\n");

let tries = 6;
let guess = "";
let word = "";

const validate = () => {
  const letters = word.split("");
  const guessLetters = guess.split("");
  let result = "";

  guessLetters.forEach((letter, index) => {
    if (letters[index] === letter) {
      result += `\x1b[32m${letter}\x1b[0m`;
    } else if (letters.includes(letter)) {
      result += `\x1b[33m${letter}\x1b[0m`;
    } else {
      result += `\x1b[30m${letter}\x1b[0m`;
    }
  });

  console.log(result);
};

const prompt = async () => {
  tries = 0;
  guess = "";
  word = words[Math.floor(Math.random() * words.length)];

  while (tries < 1 && guess !== word) {
    const response = await prompts({
      type: "text",
      name: "guess",
      message: "What's your guess?",
      validate: (guess) => (guess.length != 5 ? `Wrong length!` : true),
    });
    guess = response.guess;
    validate();
    tries += 1;
  }

  console.log(`\x1b[33mⓘ It was: ${word}\x1b[0m`);

  const { confirm } = await prompts({
    type: "confirm",
    name: "confirm",
    initial: true,
    message: `You ${
      guess === word ? "\x1b[32mWON\x1b[0m" : "\x1b[31mLOST\x1b[0m"
    }! Again?`,
  });

  if (confirm) await prompt();
};

(async () => await prompt())();
