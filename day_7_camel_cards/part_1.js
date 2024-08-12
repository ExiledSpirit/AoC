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
  2: 0,
  3: 1,
  4: 2,
  5: 3,
  6: 4,
  7: 5,
  8: 6,
  9: 7,
  T: 8,
  J: 9,
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
  for (let i = 0; i < hand.length; i++) {
    const char = hand.charAt(i);
    if (usedChars.some((usedChar) => usedChar.char == char)) continue;

    const charObject = {char, count: 1};
    const substring = hand.substring(i + 1, hand.length);

    for (let c = 0; c < substring.length; c++) {
      const compareChar = substring.charAt(c);
      if (char == compareChar) {
        charObject.count += 1;
      }
    }
    usedChars.push(charObject)
  }

  const five = usedChars.filter(usedChar => usedChar.count === 5).length;
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
  } else if (two === 2) return HAND_RANKS.two_pair;
  else if (two) return HAND_RANKS.two;
  return HAND_RANKS.high_card;
}
