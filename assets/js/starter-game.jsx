import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<Memory />, root);
}


class Memory extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cards: this.randomizeCards(), // list of Card
      numClicks: 0,
    };
  }

  randomizeCards() {
    let cards = [];
    let x, y;
    let count = 0;
    let letters = ["A", "A", "B", "B", "C", "C", "D", "D", "E", "E", "F", "F", "G", "G", "H", "H"];
    letters  = _.shuffle(letters);
    for(x = 0; x != 4; x++) {
      for(y = 0; y != 4; y++) {
        cards[count] = { letter: letters.pop(), 
                      pos: [x, y],
                      completed: false,
                      guessed: false};
        count++;
      }
    }
    return cards;
  }

  resetState() {
    let cards = this.randomizeCards();
    let xs = {
      cards: cards,
      numClicks: 0,
      };
    this.setState(xs);
  }

  getNumClicks() {
    return this.state.numClicks;
  }

  add1NumClicks() {
    let input = this.state.numClicks + 1;
    let st1 = _.extend(this.state, { numClicks: input });
    this.setState(st1);
  }

  markFlipped(index) {
    let newCard = _.extend(this.state.cards[index], {guessed: true});
    let xs = this.state.cards.splice(index, 1, newCard); 
    this.setState({ cards: xs });
  }

  onClickCard(pos, index) {
    // do nothing on click if the cards are completed.
    if(this.state.cards[index].completed || 
       this.getNumberOfGuesses() == 2 ||
       this.state.cards[index].guessed) {
      return;
    }
    this.markFlipped(index);
    this.cardMatch(index);
    this.add1NumClicks();
  }

  // deals with if there is a match in cards.
  // If there isn't, it hides both of them.
  // If there is, it adds them to "completed" and they stay up.
  // this does nothing if only one is flipped.
  cardMatch(index) {
    let card = this.state.cards[index];
    let matchIndex = this.findGuessed(card);
    if(matchIndex == -1) {
      return; // no other guessed cards, no match.
    }
    let matchCard = this.state.cards[matchIndex];

    // letter matches, set both to complete.
    if(_.isEqual(card.letter, matchCard.letter)) {
      let newCard = _.extend(card, {completed: true, guessed: false});
      let newMatchCard = _.extend(matchCard, {completed: true, guessed: false});
      let newCards = this.state.cards.splice(index, 1, newCard);
      newCards = newCards.splice(matchIndex, 1, newMatchCard);
      this.setState({ cards: newCards});
    }
    // letter doesn't match.
    else {
      // wait for a sec, then set all guessed to false.
      setTimeout(
        () => {
          let xs = _.map(this.state.cards, (card) => {
            return _.extend(card, {guessed: false});
          });
          this.setState({ cards: xs });
        },1000);
    }
  }
  
  // if there's a card that's guessed, return its index.
  // if there is no other card that's guessed, return -1.
  findGuessed(card) {
    let i;
    for(i = 0; i != 16; i++) {
      if (this.state.cards[i].guessed == true && 
          !(_.isEqual(this.state.cards[i].pos, card.pos))) {
        return i;
      }
    }
    return -1;
  }

  getNumberOfGuesses() {
    let guessedCount = 0;
    let i;
    for(i = 0; i != 16; i++) {
      if(this.state.cards[i].guessed == true) {
        guessedCount++;
      }
    }
    return guessedCount;
  }

  // set all guessed to false.
  setGuessedToFalse() {
    let xs = _.map(this.state.cards, (card) => {
      return _.extend(card, {guessed: false});
    });
    this.setState({ cards: xs });
  }

  renderCard(i) {
    let card = this.state.cards[i];
    return <DisplayCard number={i} 
                        card = {card}
                        clickCard={this.onClickCard.bind(this)} />;
  }

  renderCards() {
    let i, j;
    let count = 0;
    let returnString = "";
    for(i = 0; i != 4; i++) {
      returnString +='<div> className="row"';
      for(j = 0; j != 4; j++) {
        returnString+='{this.renderCard(' + count + ')}';
        count++;
      }
      returnString += '</div>';
    }
  }

  render() {
    return (
    <div>
      <div className="column">
        <button onClick={this.resetState.bind(this)}>Reset</button>
      </div>
      <div className="row">
        <h2>Memory Game</h2>
      </div>
      <div className="row">
        <p>Number of guesses: {this.state.numClicks}</p>
      </div>
      <div className="row">
        {this.renderCard(0)}
        {this.renderCard(1)}
        {this.renderCard(2)}
        {this.renderCard(3)}
      </div>
      <div className="row">
        {this.renderCard(4)}
        {this.renderCard(5)}
        {this.renderCard(6)}
        {this.renderCard(7)}
      </div>
      <div className="row">
        {this.renderCard(8)}
        {this.renderCard(9)}
        {this.renderCard(10)}
        {this.renderCard(11)}
      </div>
      <div className="row">
        {this.renderCard(12)}
        {this.renderCard(13)}
        {this.renderCard(14)}
        {this.renderCard(15)}
      </div>
    </div>
    );
  }
}


// When we display a card, we should use each 
function DisplayCard(params) {
  let letter = params.card.letter;
  let flipped = params.card.guessed || params.card.completed;
  let pos = params.card.pos;
  if(flipped == true) {
  return <button className="buttonAnswer" onClick={() => params.clickCard(pos, params.number)}> [{letter}]  </button>;
  }
  return <button className="buttonGuess" onClick={() => params.clickCard(pos, params.number)}> [??] </button>;
}

