/*
 * File: Adventure.js
 * ------------------
 * This program plays the CS 106AJ Adventure game.
 */

function Adventure() {
   let game = AdvGame();
   if (game === undefined) {
      console.log("There is no data file for this adventure.");
   } else {
      console.log("Welcome to Adventure!");
      game.play();
   }
}
