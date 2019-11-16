const Deck = require('./deck');
const { gameLogger } = require('../../../logger');

class CardGameTable {
  constructor(
    name,
    quantityRounds,
    maxPlayers,
    isProtected = false,
    password = null
  ) {
    this.name = name;
    this.isProtected = isProtected;
    this.quantityRounds = quantityRounds;
    this.maxPlayers = maxPlayers;
    this.password = password;
    this.players = [];
    this.ranking = [];
    this.roundInProgress = false;
    this.currentRound = null;
    this.deck = new Deck();
    this.currentPlayerTurn = 0;
    this.rounds = {};
  }

  setCardInRound(data) {
    if (this.rounds[this.currentRound] === undefined) {
      this.rounds[this.currentRound] = [];
    }

    this.rounds[this.currentRound][data.playerId] = data.card;

    if (this.currentPlayerTurn === this.players.length - 1) {
      // TODO: ADICIONAR QUEM GANHOU A RODADA;
      gameLogger.info(`RODADA FINALIZADA ${this.currentRound}`);
      this.startRound();
    }
  }

  changeCurrentPlayerTurn() {
    this.currentPlayerTurn += 1;
  }

  distributeGameCards(copyCards, joker) {
    this.players.forEach(player => {
      for (let j = 0; j < this.currentRound; j += 1) {
        player.deck.push(this.deck.getCards(copyCards[j], joker));
      }
      copyCards.splice(0, this.currentRound);
    });
  }

  joinGame(player) {
    // TODO: implementar entrar no jogo;
    this.players.push(player);
  }

  startGame() {
    if (this.currentRound !== null) this.players.push(this.players.shift());
    this.startRound();
  }

  startRound() {
    if (this.currentRound < this.quantityRounds) {
      this.roundInProgress = true;
      this.currentRound += 1;
      this.currentPlayerTurn = 0;
      const copyCards = Array.from(this.deck.cards);
      this.deck.shuffle(copyCards);
      const joker = this.deck.getCards(copyCards.shift());
      this.distributeGameCards(copyCards, joker);
    }
  }

  addPlayer(player) {
    if (this.players.length > this.maxPlayers)
      throw new Error('Número de jogadores maximo atigido');

    this.players.push(player);
  }

  calcScore() {
    // TODO: Implementar calculo de pontuação
  }

  playerBet(playerId, bet) {
    const currentPlayer = this.players.find(player => player.id === playerId);

    if (
      bet > this.currentRound ||
      (this.playerIndex(playerId) === this.players.length - 1 &&
        !this.isValidBet())
    ) {
      gameLogger.info(`Aposta inválida user: ${playerId}, bet: ${bet}`);
      return;
    }

    currentPlayer.setBet(bet);
  }

  playerIndex(playerId) {
    return this.players.findIndex(player => player.id === playerId);
  }

  isValidBet() {
    let total = 0;
    this.players.forEach(player => {
      total += player.bet;
    });
    return total === this.currentRound;
  }

  getBets() {
    const bets = [];
    this.players.forEach(player =>
      bets.push({ username: player.username, bet: player.bet })
    );
    return bets;
  }
}

module.exports = CardGameTable;
