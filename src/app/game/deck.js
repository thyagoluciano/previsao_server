/* eslint-disable no-bitwise */
class Deck {
  constructor() {
    this.ranks = '2 3 4 5 6 7 8 9 10 J Q K A'.split(' ');
    this.suits = '♠︎ ♥︎ ♣︎ ♦︎'.split(' ');
    this.cards = this.initCards();
  }

  initCards() {
    const cards = new Array(52 * 2);
    for (let i = 0; i < cards.length; i += 1) {
      cards[i] = i % 52;
    }
    return cards;
  }

  getCards(i, joker = null) {
    const suit = (i / 13) | 0;
    const rank = i % 13;
    let value = rank + 2;
    let isJoker = false;

    if (joker !== null) {
      isJoker = true;
      if (this.suits[suit] === joker.suit) {
        value *= 100;
        if (this.ranks[rank] === joker.rank) value *= 1000;
      }
    }

    const color = suit % 2 ? 'red' : 'black';

    return {
      rank: this.ranks[rank],
      suit: this.suits[suit],
      value,
      color,
      isJoker,
    };
  }

  shuffle(array) {
    for (let i = 0; i < array.length; i += 1) {
      const rnd = (Math.random() * i) | 0;
      const tmp = array[i];
      array[i] = array[rnd];
      array[rnd] = tmp;
    }
    return array;
  }
}

module.exports = Deck;
