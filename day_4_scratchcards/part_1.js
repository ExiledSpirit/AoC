const fs = require('node:fs');

let data;

try {
  data = fs.readFileSync('./input.txt', 'utf8');
} catch (err) {
  console.error(err);
  throw err;
}

const gamesString = data.split('\n');
const games = [];

createGamesArray(games, gamesString);
console.log(getGeneralScore(games));

function createGamesArray(outputList, gamesStringList) {
  for (let i = 0; i < gamesStringList.length; i++) {
    const pileCards =  gamesStringList[i].split(':')[1].split('|')[0].trim().replace(/\s+/g, ' ').split(' ');
    const myCards =  gamesStringList[i].split(':')[1].split('|')[1].trim().replace(/\s+/g, ' ').split(' ');
    outputList.push({ id: i + 1, pileCards, myCards, score: 0, cardQuantity: 0 });
    const cardQuantity = getAmmountMatchingCards(pileCards, myCards);
    outputList[i].cardQuantity = cardQuantity;
    outputList[i].score = cardQuantity > 0 ? (2 ** (cardQuantity - 1)) : cardQuantity;
  }
}


function getGeneralScore(gameList) {
  return gameList.reduce((sum, game) => sum + game.score, 0)
}

function getAmmountMatchingCards(pileCards, myCards) {
  return myCards.reduce((sum, myCard) => pileCards.includes(myCard) ? ++sum : sum, 0);
}