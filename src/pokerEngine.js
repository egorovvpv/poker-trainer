const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const SUITS = ['s', 'c', 'h', 'd']; // s - пики, c - крести, h - черви, d - бубны

export function generateDeck() {
  const deck = [];
  for (let rank of RANKS) {
    for (let suit of SUITS) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

export function dealStartingHand() {
  const deck = generateDeck();
  
  const card1Index = Math.floor(Math.random() * deck.length);
  const card1 = deck.splice(card1Index, 1)[0];
  
  const card2Index = Math.floor(Math.random() * deck.length);
  const card2 = deck.splice(card2Index, 1)[0];
  
  return [card1, card2];
}

export function convertToChartFormat(card1, card2) {
  const rank1Index = RANKS.indexOf(card1.rank);
  const rank2Index = RANKS.indexOf(card2.rank);
  
  let highCard, lowCard;
  
  if (rank1Index >= rank2Index) {
    highCard = card1;
    lowCard = card2;
  } else {
    highCard = card2;
    lowCard = card1;
  }
  
  if (highCard.rank === lowCard.rank) {
    return `${highCard.rank}${lowCard.rank}`;
  }
  
  if (highCard.suit === lowCard.suit) {
    return `${highCard.rank}${lowCard.rank}s`;
  }
  
  return `${highCard.rank}${lowCard.rank}o`;
}

// Вспомогательная функция для красивого отображения мастей иконками
export function getSuitIcon(suit) {
  switch(suit) {
    case 's': return '♠️';
    case 'c': return '♣️';
    case 'h': return '♥️';
    case 'd': return '♦️';
    default: return suit;
  }
}
