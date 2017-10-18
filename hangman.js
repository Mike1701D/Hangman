// Global Variables
var inquirer = require("inquirer");
var placeVariable;
var iterations;
var guessStorage;
var endGame;

var userStart = function () {
    // Prompt to Start Game
    console.log("Welcome to Doctor Who hangman!");
    placeVariable = [];
    iterations = 10;
    guessStorage = [];
    endGame = 0;
    StartGame();
}

// Constructor Function to Select a Random Hangman Word
function StartGame(wordArray) {
    console.log("\n");
    var wordArray = ["sonic", "dalek", "tardis", "doctor", "donna", "martha", "bill", "gallifrey", "rose", "cybermen", "pond", "angel", "rory", "run"];
    var wordNumber = [];
    var randNum = Math.trunc((Math.random()) * 10);
    var word = [];
    this.wordArray = wordArray;
    word = this.wordArray[randNum];
    word = word.split("");
    // console.log(word); - diagnostic console.log
    var wordLength = word.length;
    for (var count = 0; count < wordLength; count++) {
        wordNumber[count] = -1;
        process.stdout.write("_ ");
    }
    console.log("\n");
    receiveLetter(word, wordNumber);
}

// Function to Validate User Input as a Single Letter
function receiveLetter(word, wordNumber) {
    console.log("\n");
    inquirer.prompt([
    {
        type: "input",
        name: "userLetter",
        message: "Type a letter to guess:"
    }
    ]).then(function(user) {
        // Truncate any letters after first letter; check for non-letters
        if (user.userLetter === user.userLetter.substring(0, 1) && user.userLetter.match(/[a-z]/i)) {
            testLetter(user.userLetter, word, wordNumber);
        } else {
            console.log("Type just one letter [a through z]");
            receiveLetter(word, wordNumber);
        }
    });
}

// Function to Validate User Input for Repeats and Correct Guesses
function testLetter(letter, word, wordNumber) {
    var i = 0;
    var duplicateTest = 0;
    do {
        if (letter === guessStorage[i]) {
            console.log("You already guessed that letter.  Try again.\n");
            duplicateTest = 1;
        }
        i++;
    }
    while (i < guessStorage.length);
    if (duplicateTest === 0) {
        guessStorage.push(letter);
        var confirm = 0;
        var wordLength = word.length;
        var comparison = [];
        for (i = 0; i < wordLength; i++) {
            comparison.push(i);
            comparison.sort();
            // console.log(comparison); - diagnostic console.log
        }
        for (i = 0; i < wordLength; i++) {
            if (letter === word[i]) {
                wordNumber[i] = 1;
                placeVariable.push(i);
                placeVariable.sort();
                confirm = 1;
                // console.log(placeVariable); - diagnostic console.log
            }
        }
        if (confirm === 0) {
            iterations--;
            console.log("You guessed incorrectly.");
            console.log("You have " + iterations + " guesses remaining.")
            if (iterations < 1) {
                endLose(word);
            }
        }
        if (JSON.stringify(placeVariable) === JSON.stringify(comparison)) {
            endWin(word);
        }
    }
    if (endGame === 0) {CompleteBlanks(word, placeVariable, wordNumber);}
}

// Constructor Function to Show Blanks and Correct Guesses
function CompleteBlanks(word, placeVariable, wordNumber) {
    this.word = word;
    this.placeVariable = placeVariable;
    this.wordNumber = wordNumber;
    var wordLength = word.length;
    var i = 0;
    do {
        if (this.wordNumber[i] === 1) {
            process.stdout.write(this.word[i]);
        } else {
            process.stdout.write("_ ");
        }
        i++;
    } while (i < word.length);
    receiveLetter(this.word, this.wordNumber);
}

// Function for User Win
function endWin(word) {
    console.log("You win.  The word was:");
    showWord(word);
}

// Function for User Lose 
function endLose(word) {
    console.log("You lose.  The word was:");
    showWord(word);
}

// Function to Show Word
function showWord(word) {
    var i;
    for (i = 0; i < word.length; i ++) {
        process.stdout.write(word[i]);
    }
    playAgain();
}

// Function to Play Again
function playAgain() {
	console.log("\n");
	 inquirer.prompt([
    {
        type: "input",
        name: "replay",
        message: "Press Y to play again."
    }
    ]).then(function(user) {
        if (user.replay === "Y" || user.replay === "y") {
            console.log("\n");
            userStart();
        } else {
            process.exit(1);
        }
    });
    endGame = 1;
}

// Prompt to Start Game
userStart();