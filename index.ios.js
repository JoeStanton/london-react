/* @flow */

import regenerator from 'regenerator/runtime';
import React from 'react-native';
import Icon from 'FAKIconImage';
import dedent from 'dedent';

var {
  AppRegistry,
  NavigatorIOS,
  Navigator,
  StatusBarIOS,
  StyleSheet,
  Text,
  Image,
  View,
  LinkingIOS,
  AlertIOS,
  TouchableOpacity,
  PushNotificationIOS,
  AsyncStorage
} = React;

// TODO: Bind, Decorators

class LondonReact extends React.Component {
  componentWillMount() {
    StatusBarIOS.setStyle('light-content');

    PushNotificationIOS.addEventListener('register', this._savePushToken);
    PushNotificationIOS.addEventListener('notification', this._notificationReceived);
    PushNotificationIOS.requestPermissions(this._savePushToken);
  }
  async _savePushToken(token) {
    await AsyncStorage.setItem('pushToken', token);
    alert(token);
  }
  _notificationReceived(notification) {
    alert(notification);
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
    {
      name: 'Joe Stanton',
      title: 'Software Engineer at Red Badger',
      bioPic: 'https://pbs.twimg.com/profile_images/560477578750738432/fCSqb4Px_400x400.png',
      talk: 'Real World React Native & ES7',
      synopsis: 'React Native apps are now packaged with Babel.',
      twitter: 'joe_stant',
      github: 'JoeStanton'
    },
    {
      name: 'Michal Kawalec',
      title: 'Senior Software Engineer at X-Team',
      talk: 'fluxApp',
      synopsis: dedent`
        React has taken the web development scene by storm. It took the concepts we held dear and turned them around to make us rethink what we knew about the web. Then Flux came along to provide a valuable solution to building large scale projects.

        Yet, to this day little work has been done to deliver on one of the biggest promises of React, isomorphism. A lot of boilerplate is required to seamlessly execute your components on both the server and the client. We bring a solution to the table, with a set of essential libraries. Along the way we made Flux even more awesome to enable you to focus on implementing functionality, not wheels.

        So, take a seat and expect to be guided into a wonderful world, where data flows one way and your pages load in a blink of an eye.
      `,
      bioPic: 'https://avatars0.githubusercontent.com/u/496144?v=3&s=400',
      twitter: 'b4zzl3',
      github: 'mkawalec'
    },
    { name: 'Prospective Speaker', talk: 'Speaking Slot Available', empty: true },
  ];

  constructor() {
    super();
    this._fetchAttendees();
  }

  async _fetchAttendees() {
    const apiKey = process.env.MEETUP_API_KEY;
    const eventId = 223123000;
    const url = `https://api.meetup.com/2/event/${eventId}?key=${apiKey}&sign=true&photo-host=public&page=20`;

    let json;
    try {
      const response = await fetch(url);
      json = await response.json();
    } catch(e) {
      AlertIOS.alert('Failed to fetch attendees');
    }

    this.setState({attending: json.yes_rsvp_count});
  }

  render() {
    return (
      <View style={styles.emptyPage}>
        <Date date="Tuesday, June 30, 2015" />
        <Venue name="Facebook HQ" address="10 Brock Street, Regents Place, London" />
        <Talks talks={this.talks} navigator={this.props.navigator} />
        <Attending count={this.state.attending} />
      </View>
    );
  }
}

class Date extends React.Component {
  render() {
    let _openCalendar = x => {
      LinkingIOS.openURL('calshow://');
    };

    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={styles.section} onPress={_openCalendar}>
          <Text style={styles.sectionTitle} onPress={_openCalendar}>Date</Text>
          <Text onPress={_openCalendar}>{this.props.date}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class Venue extends React.Component {
  render() {
    let _openMaps = x => {
      LinkingIOS.openURL('http://maps.apple.com/?q=' + encodeURIComponent(`${this.props.name}, ${this.props.address}`));
    };

    return (
      <TouchableOpacity onPress={_openMaps}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Venue</Text>
          <Text>{this.props.name}</Text>
          <Text>{this.props.address}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class Button extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={[this.props.style, styles.button]}>
          {this.props.icon && <Icon
            name={`fontawesome|${this.props.icon}`}
            size={30}
            color='black'
            style={styles.icon}
          />}
          <Text style={styles.buttonText}>{this.props.text}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class Twitter extends React.Component {
  _open() {
    const twitterAppURL = `twitter://user?screen_name=${this.props.handle}`;
    const browserURL = `https://twitter.com/${this.props.handle}`;

    LinkingIOS.canOpenURL(twitterAppURL, supported => {
      LinkingIOS.openURL(supported ? twitterAppURL : browserURL);
    });
  }
  render() {
    return (
      <Button icon="twitter" text={`@${this.props.handle}`} onPress={this._open.bind(this)} />
    );
  }
}

class Github extends React.Component {
  _open() {
    LinkingIOS.openURL(`https://github.com/${this.props.handle}`);
  }
  render() {
    return (
      <Button icon="github" text={this.props.handle} onPress={this._open.bind(this)} style={{borderLeftWidth: 1}} />
    );
  }
}

class TalkDetails extends React.Component {
  render() {
    return (
      <View style={styles.emptyPage}>
        <Text>{this.props.title}</Text>
        <View style={styles.bioContainer}>
          <View>
          <Image
            style={styles.bioPic}
            source={{uri: this.props.speaker.bioPic}}
          />
          </View>
          <Text style={styles.sectionTitle}>{this.props.speaker.name}</Text>
          <Text>{this.props.speaker.title}</Text>
          <Text style={styles.synopsis}>{this.props.speaker.synopsis}</Text>
        </View>
        <View style={styles.buttonContainer}>
        <Twitter handle={this.props.speaker.twitter} />
        <Github handle={this.props.speaker.github} />
        </View>
      </View>
    );
  }
}

class Talks extends React.Component {
  render() {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Talks</Text>
        {this.props.talks.map(speaker => <Talk speaker={speaker} navigator={this.props.navigator} />)}
      </View>
     );
  }
}

class Talk extends React.Component {
  _talkDetails() {
    if (this.props.speaker.empty) { return; }

    this.props.navigator.push({
      title: this.props.speaker.talk,
      component: TalkDetails,
      passProps: this.props
    });
  }
  render() {
    const {speaker} = this.props;
    return (
      <TouchableOpacity onPress={this._talkDetails.bind(this)}>
        <View style={styles.section}>
            <Text style={styles.talkTitle}>{speaker.talk}</Text>
            <Text>{speaker.name}</Text>
            <Text>{speaker.title}</Text>
        </View>
      </TouchableOpacity>
     );
  }
}

class Attending extends React.Component {
  render() {
    if (!this.props.count) {
      return null;
    }

    return (
      <View style={styles.section}>
        <Text>{this.props.count} Attending</Text>
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
    fontWeight: 'bold'
  },
  bioContainer: {
    flex: 1,
    alignItems: 'center'
  },
  bioPic: {
    width: 180,
    height: 180,
    borderRadius: 90
  },
  attending: {
    justifyContent: 'center'
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    borderLeftColor: 'lightgray',
    padding: 5,
  },
  buttonText: {
  },
  icon: {
    width: 30,
    height: 30
  },
  synopsis: {
    margin: 10,
  }
});

AppRegistry.registerComponent('LondonReact', () => LondonReact);
