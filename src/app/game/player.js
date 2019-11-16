class Player {
  constructor(socketId, username) {
    this.id = socketId;
    this.username = username;
    this.deck = [];
    this.bet = null;
  }

  setBet(bet) {
    this.bet = bet;
  }

  addCardsToDeck(cards) {
    this.deck = cards;
  }

  playCard() {
    /* TODO: 
      verificar se é a vez do jogador
      verificar se a rodada iniciou com coringa
      se sim verificar se jogador tem curinga
      se sim so é permitido jogar curinga
      se não pode jogar qualquer carta
    */
  }

  betForecast() {
    /* TODO: 
      verificar se é a vez do jogador
      se sim jogador informa sua aposta, 
      validar se aposta e maior do que permitido
      se for o ultimo jogador calcular se a aposta é valida
    */
  }
}

module.exports = Player;
