import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import { NativeRouter, Route, Link, Switch } from 'react-router-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const SIZE = 80;

const TYPES = [
  'ios-bicycle',
  'ios-beer',
  'ios-cafe',
  'ios-bug',
  'ios-basketball',
  'ios-camera',
  'ios-hammer',
  'ios-rocket'
];

function createModel(types) {
  return types
    .reduce((acc, curr) => {
      const card = {
        type: curr,
        flipped: false,
        matched: false
      };
      acc.push({...card});
      acc.push({...card});
      return acc;
    }, [])
    .sort(() => Math.random() > .5)
    .map((card, i) => ({...card, key: i }));
}

const Board = ({ cards, handleCardClick }) => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
    { cards.map(card => <Card model={card} key={card.key} handleCardClick={handleCardClick}/>) }
  </View>
);

class Card extends React.Component {
  handlePress = () => {
    this.props.handleCardClick(this.props.model);
  };

  render() {
    const { model } = this.props;

    if (model.matched) {
      return (
        <View style={cardStyles.card}>
          <View style={cardStyles.icon}>
            <Ionicons name={model.type} size={SIZE} color={'#00ff00'} />
          </View>
        </View>
      );
    }

    return (
      <TouchableWithoutFeedback onPress={this.handlePress}>
        <View style={cardStyles.card}>
          <View style={cardStyles.icon}>
            <Ionicons name={model.type} size={SIZE}/>
          </View>
          { !model.flipped && <View style={cardStyles.curtain}></View>}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const Routes = () => (
  <NativeRouter>
    <Switch>
      <Route path={'/'} exact component={StartPage} />
      <Route path={'/game'} component={GamePage} />
    </Switch>
  </NativeRouter>
);

const StartPage = () => (
  <Animatable.View animation={'zoomInUp'} style={styles.container}>
    <Text>Start</Text>
    <Link to={'/game'}>
      <Text style={styles.link}>Zagraj</Text>
    </Link>
  </Animatable.View>
);


class GamePage extends React.Component {
  state = {
    cards: createModel(TYPES),
    previousType: '',
    flippedCards: []
  };

  handleCardClick = (clickedCard) => {
    const  { flippedCards } = this.state;
    if (flippedCards.length === 2) {
      return;
    }

    if (flippedCards.length === 1) {
      this.flipCardsBackOrMatch(clickedCard);
    }

    if (flippedCards.length < 2) {
      this.flipCard(clickedCard);
    }
  };

  flipCard(clickedCard) {
    const { flippedCards, cards } = this.state;

    this.setState({
      previousType: clickedCard.type,
      flippedCards: [...flippedCards, clickedCard.key],
      cards: cards.map(card => {
        if (card.key === clickedCard.key) {
          return {
            ...card,
            flipped: true
          }
        }

        return card;
      })
    });
  }

  flipCardsBackOrMatch(clickedCard) {

    const { previousType } = this.state;
    const matched = previousType === clickedCard.type;

    setTimeout(() => {
      const { flippedCards, cards } = this.state;

      this.setState({
        flippedCards: [],
        previousType: '',
        cards: cards.map(card => {
          if (flippedCards.includes(card.key)) {
            return {
              ...card,
              flipped: false,
              matched,
            }
          }

          return card;
        })
      })
    }, 1000);
  }

  render() {
    const { cards } = this.state;
    return (
      <Animatable.View animation={'zoomInUp'} style={styles.container}>
        <Board cards={cards} handleCardClick={this.handleCardClick}/>
        <Link to={'/'}>
          <Text style={styles.link}>Powrót</Text>
        </Link>
      </Animatable.View>
    );
  }
}


export default class App extends React.Component {
  render() {
    return (
      <Routes />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    padding: 10,
    fontSize: 20
  }
});

const cardStyles = StyleSheet.create({
  card: {
    width: SIZE,
    height: SIZE,
    margin: 5
  },
  icon: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center'
  },
  curtain: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    backgroundColor: '#ff0000',
  }
});
