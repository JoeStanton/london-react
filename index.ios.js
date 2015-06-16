require("babel/polyfill");

var React = require('react-native');
var {
  AppRegistry,
  NavigatorIOS,
  StatusBarIOS,
  StyleSheet,
  Text,
  View,
  LinkingIOS
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
  state = {
    attending: null
  }

  talks = [
    { name: "Joe Stanton", title: "Software Engineer at Red Badger", talk: "Real World React Native & ES7" },
    { name: "Michal Kawalec", title: "Senior Software Engineer at X-Team", talk: "fluxApp" },
    { name: "Prospective Speaker", talk: "Speaking Slot Available" },
  ];

  constructor() {
    super();
    this._fetchAttendees();
  }

  async _fetchAttendees() {
    const apiKey = '696d29214c7358804e715564725a4c77';
    const eventId = 223123000;
    const url = `https://api.meetup.com/2/event/${eventId}?key=${apiKey}&sign=true&photo-host=public&page=20`;

    try {
      const response = await fetch(url);
      const json = await response.json();
    } catch(e) {
      alert("Failed to fetch attendees");
    }

    this.setState({attending: json.yes_rsvp_count});
  }

  render() {
    return (
      <View style={styles.emptyPage}>
        <Date date="Tuesday, June 30, 2015"/>
        <Venue name="Facebook HQ" address="10 Brock Street, Regents Place, London" />
        <Talks talks={this.talks} />
        <Attending count={this.state.attending} />
      </View>
    );
  }
}

class Date extends React.Component {
  render() {
    let _openCalendar = x => {
      LinkingIOS.openURL('calshow://');
    }

    return(
      <View style={styles.section} onPress={_openCalendar}>
        <Text style={styles.sectionTitle} onPress={_openCalendar}>Date</Text>
        <Text onPress={_openCalendar}>{this.props.date}</Text>
      </View>
    );
  }
}

class Venue extends React.Component {
  render() {
    let _openMaps = x => {
      LinkingIOS.openURL('http://maps.apple.com/?q=' + encodeURIComponent(`${this.props.name}, ${this.props.address}`));
    }

    return(
      <View style={styles.section} onPress={_openMaps}>
        <Text style={styles.sectionTitle} onPress={_openMaps}>Venue</Text>
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

class Attending extends React.Component {
  render() {
    if(!this.props.count) {
      return null;
    }

    return(
      <View style={styles.section}>
        <Text>{this.props.count} Attending</Text>
      </View>
    )
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
  },
  attending: {
    justifyContent: 'center'
  }
});

AppRegistry.registerComponent('LondonReact', () => LondonReact);

