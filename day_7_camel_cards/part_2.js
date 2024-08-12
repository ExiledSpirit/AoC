// Reading the data
const fs = require('node:fs');

let data;

const HAND_RANKS = {
  five: 7,
  four: 6,
  full_house: 5,
  three: 4,
  two_pair: 3,
  two: 2,
  high_card: 1
}

const CARD_POWERS = {
  J: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  8: 7,
  9: 8,
  T: 9,
  Q: 10,
  K: 11,
  A: 12
}

try {
  data = fs.readFileSync('./input.txt', 'utf8');
} catch (err) {
  console.error(err);
  throw err;
}

const handList = data.split('\r\n').map((handIndex) => {
  return {
    hand: handIndex.split(' ')[0],
    bid: parseInt(handIndex.split(' ')[1]),
    rank: calculateHandRank(handIndex.split(' ')[0])
  }
});
handList.sort(compareHands)

console.log(calculateTotalBid(handList))

function calculateTotalBid(handSet) {
  return handSet.reduce((acc, hand, index) => acc + (hand.bid * (index + 1)), 0)
}

function compareHands(handA, handB) {

  if (handA.rank === handB.rank) {
    for (let i = 0; i < handA.hand.length; i++) {
      const charA = handA.hand.charAt(i);
      const charB = handB.hand.charAt(i);
      if (charA !== charB) {
        return CARD_POWERS[charA] - CARD_POWERS[charB];
      }
    }

    return 0;
  }

  return handA.rank - handB.rank
}

function calculateHandRank(hand) {
  const usedChars = []
  const numberJokers = hand.split('').filter(char => char == 'J').length
  for (let i = 0; i < hand.length; i++) {
    const char = hand.charAt(i);
    if (usedChars.some((usedChar) => usedChar.char == char)) continue;

    const charObject = {char, count: char === 'J' ? 0 : 1};
    const substring = hand.substring(i + 1, hand.length);

    for (let c = 0; c < substring.length; c++) {
      const compareChar = substring.charAt(c);
      if (char == compareChar && char !== 'J') {
        charObject.count += 1;
      }
    }
    usedChars.push(charObject)
  }

  usedChars.sort((usedA, usedB) => usedA.count - usedB.count);
  usedChars[usedChars.length - 1].count += numberJokers

  const five = usedChars.filter(usedChar => usedChar.count === 5 || usedChar.count === 6).length;
  const four = usedChars.filter(usedChar => usedChar.count === 4).length;
  const three = usedChars.filter(usedChar => usedChar.count === 3).length;
  const two = usedChars.filter(usedChar => usedChar.count === 2).length;

  if (five) {
    return HAND_RANKS.five;
  } else if (four) {
    return HAND_RANKS.four;
  } else if (three) {
    if (two) return HAND_RANKS.full_house;
    return HAND_RANKS.three
  } else if (two == 2) return HAND_RANKS.two_pair;
  else if (two) return HAND_RANKS.two;
  return HAND_RANKS.high_card;
}
