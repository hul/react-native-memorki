import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route, Link, Switch } from 'react-router-native';

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

const HomePage = () => (
  <View style={styles.container}>
    <Text style={styles.heading}>Home</Text>
    <Link to={'/game'}>
      <Text style={styles.link}>Zagraj</Text>
    </Link>
  </View>
);

const GamePage = () => (
  <View style={styles.container}>
    <Board cards={TYPES}/>
    <Link to={'/'}>
      <Text style={styles.link}>Powrót</Text>
    </Link>
  </View>
);

const Routes = () => (
  <Switch>
    <Route path={'/'} component={HomePage} exact/>
    <Route path={'/game'} component={GamePage} />
  </Switch>
);

const Board = ({ cards }) => (
  <View style={[boardStyles.board]}>
    {cards.map(card => <Card model={card} key={card}/>)}
  </View>
);

class Card extends React.Component {
  render () {
    const { model } = this.props;
    return (
      <View style={cardStyles.card}>
        <View style={cardStyles.icon}>{model.type}</View>
        <View style={cardStyles.curtain}></View>
      </View>
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
    backgroundColor: 'red',
    position: 'relative',
    margin: 5,
  },
  icon: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
  },
  curtain: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    backgroundColor: '#E36622'
  }
});
