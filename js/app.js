// create an allCards variable that holds all possible card options
// create a gameDeck variable that holds the cards in play
  // should be an array of objects
  // example objects:
    // {face: 'dA', currentPick: true/false, matched: true/false}
// create a variable numCards to represent difficulty
// create two variables cardA / cardB to store cards picked

// navbar with game title (h1)
// message element to display messages (h1 / h2?)
// button(s) to select difficulty
// reset button
// element to display timer
// card container element to append cards in play

// PSEUDOCODE:
// init function to set initial state variables
  // make sure timer isn't already running before starting game
// function to handle difficulty selection
  // add this to an event listener on difficulty buttons
// function to randomly pick pairs of cards (based on difficulty selected) and copy them from the allCards deck into the gameDeck, then render
// function to shuffle the gameDeck
// function to manage timer
// function to check whether two selected cards are matches
// render function
  // loop through all cards in play and render based on whether they're currently selected, already matched, or not selected