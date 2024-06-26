/*------------------ Constants --------------------*/

// create an allCards variable that holds all possible card options
const allCards = ["dA","dQ","dK","dJ","d10","d09","d08","d07","d06","d05","d04","d03","d02","hA","hQ","hK","hJ","h10","h09","h08","h07","h06","h05","h04","h03","h02","cA","cQ","cK","cJ","c10","c09","c08","c07","c06","c05","c04","c03","c02","sA","sQ","sK","sJ","s10","s09","s08","s07","s06","s05","s04","s03","s02"]

const difficultyOptions = {
  easy: 5,
  medium: 8,
  hard: 12
}

/*--------------- Variables (state) ----------------*/

// create a gameDeck variable that holds the cards in play
  // should be an array of objects
  // example objects:
    // {face: 'dA', currentPick: true/false, matched: true/false}
let gameDeck = []
// create a variable numCards to represent difficulty
let numCards
// create two variables selectedIdx1/selectedIdx2 to store cards picked
let selectedIdx1, selectedIdx2
let gameIsInPlay, turn, numPairsToFind, timeRemaining,
timerIntervalId, cantClickYet

/*------------- Cached Element References -----------*/

// message element to display messages (h1 / h2?)
const messageEl = document.getElementById('message')
const buttonContainer = document.querySelector('.button-container')
const resetButtonContainer = document.querySelector('.reset-button-container')
const resetBtn = document.getElementById('reset')
const cardContainerEl = document.querySelector('.card-container')


/*----------------- Event Listeners ----------------*/
buttonContainer.addEventListener('click', handleSelectDifficulty)
resetBtn.addEventListener('click', init)
cardContainerEl.addEventListener('click', handleSelectCard)

/*------------------- Functions ---------------------*/
init()

function init() {
  gameIsInPlay = false
  cantClickYet = false
  gameDeck = []
  turn = 1
  render()
}

function startTimer() {
  if (timerIntervalId) {
    clearInterval(timerIntervalId)
  }
  timerIntervalId = setInterval(tick, 1000)
}

function tick() {
  console.log(timeRemaining)
  timeRemaining -= 1
  if (timeRemaining === 0) {
    clearInterval(timerIntervalId)
    // display a loss message
    if (numPairsToFind === 1) {
      setMessage(`Time is up, you missed ${numPairsToFind} match!  You've been TOTTED!`)
    } else {
      setMessage(`Time is up, you missed ${numPairsToFind} matches!  You've been TOTTED!`)
    }
  }
}

function setMessage(message) {
  messageEl.textContent = message
}

function handleSelectCard(evt) {
  if (evt.target.classList.contains('card') && !cantClickYet) {
    let cardIdx = parseInt(evt.target.id.substring(5))
    if (turn === 1) {
      setMessage('Find the match!')
      selectedIdx1 = cardIdx
      gameDeck[cardIdx].currentlySelected = true
      turn *= -1
    } else {
      selectedIdx2 = cardIdx
      gameDeck[cardIdx].currentlySelected = true
      compareCards()
      turn *= -1
    }
    render()
  }
}

function compareCards() {
  // cards don't match
  if (gameDeck[selectedIdx1].cardName !== gameDeck[selectedIdx2].cardName) {
    cantClickYet = true
    setMessage("You've been TOTTED!  No match!")
    setTimeout(flipCardsBackOver, 1500)
  } else {
    // cards match
    numPairsToFind -= 1
    if (numPairsToFind === 1) {
      setMessage(`You found a match! ${numPairsToFind} pair left!`)
    } else {
      setMessage(`You found a match! ${numPairsToFind} pairs left!`)
    }
    gameDeck[selectedIdx1].isMatched = true
    gameDeck[selectedIdx2].isMatched = true
    if (!numPairsToFind) {
      clearInterval(timerIntervalId)
      setMessage('You found all the matches and defeated the evil TOT!')
    }
  }
}

function handleSelectDifficulty(evt) {
  gameDeck = generateDeck(evt.target.id)
  numPairsToFind = difficultyOptions[evt.target.id]
  console.log(gameDeck)
  timeRemaining = 5 * difficultyOptions[evt.target.id]
  startTimer()
  setMessage('Please select a card!')
  gameIsInPlay = true
  render()
}

function generateDeck(difficulty){
  let pairsToAdd = difficultyOptions[difficulty]
  let deckCopy = [...allCards]
  let cardsToAdd = []
  
  for (let i = 1; i <= pairsToAdd; i++ ) {
    let randIdx = Math.floor(Math.random() * deckCopy.length)
    let cardToAdd = deckCopy.splice(randIdx, 1)[0]
    cardsToAdd.push(cardToAdd, cardToAdd)
  }
  return shuffleCards(cardsToAdd)
}

function shuffleCards(cards) {
  let cardsToShuffle = [...cards]
  let numTimesToShuffle = cardsToShuffle.length
  let shuffledCards = []
  for (i = 0; i < numTimesToShuffle; i++) {
    let randIdx = Math.floor(Math.random() * cardsToShuffle.length)
    shuffledCards.push(cardsToShuffle.splice(randIdx, 1)[0])
  }
  return buildCardObjects(shuffledCards)
}

function buildCardObjects(cards) {
  let cardObjects = cards.map(card => {
    return {cardName: card, currentlySelected: false, isMatched: false}
  })
  return cardObjects
}

function flipCardsBackOver() {
  // set the gameDeck[selectedIdx].currentlySelected back to false
  gameDeck[selectedIdx1].currentlySelected = false
  gameDeck[selectedIdx2].currentlySelected = false
  cantClickYet = false
  // render
  setMessage('Please select a card!')
  render()
}


function render() {
  if (gameIsInPlay) {
    resetButtonContainer.style.display = ''
    buttonContainer.style.display = 'none'
  } else {
    resetButtonContainer.style.display = 'none'
    buttonContainer.style.display = ''
  }
  cardContainerEl.innerHTML = ''
  gameDeck.forEach((cardObj, idx) => {

    // card can be a current selection (only 2x)
    // card can be already matched
    if (cardObj.currentlySelected || cardObj.isMatched) {
      let newCardEl = document.createElement('div')
      newCardEl.className = `card large ${cardObj.cardName}`
      newCardEl.id = `card-${idx}`
      cardContainerEl.appendChild(newCardEl)
    } else {
      // card can be hidden
      let newCardEl = document.createElement('div')
      newCardEl.className = 'card large tot'
      newCardEl.id = `card-${idx}`
      cardContainerEl.appendChild(newCardEl)
    }
  })
}


// TODO element to display timer


// PSEUDOCODE:
//// init function to set initial state variables
  // make sure timer isn't already running before starting game
// function to handle difficulty selection
  // add this to an event listener on difficulty buttons
// function to randomly pick pairs of cards (based on difficulty selected) and copy them from the allCards deck into the gameDeck, then render
// function to shuffle the gameDeck
// function to manage timer
// function to check whether two selected cards are matches
// render function
  // loop through all cards in play and render based on whether they're currently selected, already matched, or not selected