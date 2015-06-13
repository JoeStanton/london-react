'use strict';

var React = require('react-native');
var {
  AppRegistry,
  NavigatorIOS,
  StatusBarIOS,
  StyleSheet,
  Text,
  View
} = React;

class LondonReact extends React.Component {
  componentWillMount() {
    StatusBarIOS.setStyle('light-content');
  }

  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          component: CurrentMeetup,
          title: 'London React Meetup',
        }}
        tintColor="#FFFFFF"
        barTintColor="#be1414"
        titleTextColor="#FFFFFF"
      />
    );
  }
}

class CurrentMeetup extends React.Component {
  constructor() {
    this._talks = [
      { name: "Joe Stanton", title: "Software Engineer at Red Badger", talk: "React Native, ES6 and Concurrency" },
      { name: "Michal Kawalec", title: "Senior Software Engineer at X-Team", talk: "fluxApp" },
      { name: "Prospective Speaker", talk: "Speaking Slot Available" },
    ]
  }
  render() {
    return (
      <View style={styles.emptyPage}>
        <Date date="Tuesday, June 30, 2015"/>
        <Venue name="Facebook HQ" address="10 Brock Street, Regents Place, London" />
        <Talks talks={this._talks} />
      </View>
    );
  }
}

class Date extends React.Component {
  render() {
    return(
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Date</Text>
        <Text>{this.props.date}</Text>
      </View>
    );
  }
}

class Venue extends React.Component {
  render() {
    return(
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Venue</Text>
        <Text>{this.props.name}</Text>
        <Text>{this.props.address}</Text>
      </View>
    );
  }
}

class Talks extends React.Component {
  render() {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Talks</Text>
        {this.props.talks.map(speaker => <Talk speaker={speaker} />)}
      </View>
     );
  }
}

class Talk extends React.Component {
  render() {
    var speaker = this.props.speaker;
    return (
      <View style={styles.section}>
        <Text style={styles.talkTitle}>{speaker.talk}</Text>
        <Text>{speaker.name}</Text>
        <Text>{speaker.title}</Text>
      </View>
     );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyPage: {
    flex: 1,
    paddingTop: 64,
  },
  emptyPageText: {
    margin: 10,
  },
  section: {
    margin: 10,
  },
  sectionTitle: {
    fontSize: 20
  },
  talkTitle: {
    fontSize: 16,
    fontWeight: "bold"
  }
});

AppRegistry.registerComponent('LondonReact', () => LondonReact);

