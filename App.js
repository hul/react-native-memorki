import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import { NativeRouter, Route, Link, Switch } from 'react-router-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { Audio } from 'expo';

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

const SIZE = 80;
const HIDE_TIMEOUT = 1000;

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
    .map((card, key) => ({ ...card, key}));
}

const HomePage = () => (
  <Animatable.View animation={'zoomInUp'} style={styles.container}>
    <Text style={styles.heading}>Home</Text>
    <Link to={'/game'}>
      <Text style={styles.link}>Zagraj</Text>
    </Link>
  </Animatable.View>
);

class GamePage extends React.Component {
  state = {
    cards: createModel(TYPES),
    flipped: [],
    previousType: ''
  };

  handleCardClick = (clickedCard) => {
    const { flipped } = this.state;

    if (flipped.length === 2) {
      return;
    }

    if (flipped.length === 1) {
      this.matchOrFlipCardsBack(clickedCard);
    }

    if (flipped.length < 2) {
      this.flipCard(clickedCard);
    }
  };

  flipCard(clickedCard) {
    const { flipped, cards } = this.state;
    this.setState({
      previousType: clickedCard.type,
      flipped: [ ...flipped, clickedCard.key ],
      cards: cards.map(card => {
        if (card.key === clickedCard.key) {
          return {...card, flipped: true }
        }

        return card;
      })
    });
  }

  matchOrFlipCardsBack(clickedCard) {
    const { previousType, cards } = this.state;
    const matched = clickedCard.type === previousType;

    setTimeout(() => {
      const { flipped } = this.state;

      this.setState({
        flipped: [],
        previousType: '',
        cards: cards.map(card => {
          if (flipped.includes(card.key)) {
            return {
              ...card,
              flipped: false,
              matched
            }
          }

          return card;
        })
      });
    }, HIDE_TIMEOUT);
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

const Routes = () => (
  <Switch>
    <Route path={'/'} component={HomePage} exact/>
    <Route path={'/game'} component={GamePage} />
  </Switch>
);

const Board = ({ cards, handleCardClick }) => (
  <View style={[boardStyles.board]}>
    {cards.map(card => <Card model={card} key={card.key} handleCardClick={handleCardClick}/>)}
  </View>
);

class Card extends React.Component {
  clickSound = new Audio.Sound();

  handleClick = () => {
    this.props.handleCardClick(this.props.model);
    this.playClickSound();
  };

  handleAnimationRef = ref => this.animationRef = ref;

  async initSound() {
    this.clickSound.loadAsync(require('./assets/click.mp3'));
  }

  async playClickSound() {
    await this.clickSound.setPositionAsync(0);
    await this.clickSound.playAsync();
  }

  componentDidMount() {
    this.initSound();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.model.flipped && !this.props.flipped && this.animationRef) {
      this.animationRef.slideInDown();
    }
  }

  render () {
    const { model } = this.props;
    if (model.matched) {
      return (
        <Animatable.View style={cardStyles.card} animation={'zoomOut'}>
          <View style={cardStyles.icon}>
            <Ionicons name={model.type} size={SIZE} />
          </View>
        </Animatable.View>
      );
    }
    return (
      <TouchableWithoutFeedback onPress={this.handleClick}>
        <View style={cardStyles.card}>
          <View style={cardStyles.icon}>
            <Ionicons name={model.type} size={SIZE} />
          </View>
          {!model.flipped
            ? <Animatable.View ref={this.handleAnimationRef} style={cardStyles.curtain}></Animatable.View>
            : <Animatable.View animation={'slideOutUp'} style={cardStyles.curtain}></Animatable.View>
          }
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default class App extends React.Component {
  render() {
    return (
      <NativeRouter>
        <View style={styles.container}>
          <Routes />
        </View>
      </NativeRouter>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 48,
    fontWeight: 'bold'
  },
  link: {
    fontSize: 20,
    padding: 10
  }
});

const boardStyles = StyleSheet.create({
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const cardStyles = StyleSheet.create({
  card: {
    width: SIZE,
    height: SIZE,
    overflow: 'hidden',
    position: 'relative',
    margin: 5,
  },
  icon: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    alignItems: 'center'
  },
  curtain: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    backgroundColor: '#E36622',
  }
});
