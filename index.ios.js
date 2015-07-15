/* @flow */

import regenerator from 'regenerator/runtime';
import React from 'react-native';
import Icon from 'FAKIconImage';
import dedent from 'dedent';
import Parse from './parse';

var {
  AlertIOS,
  AppRegistry,
  AsyncStorage,
  Image,
  LinkingIOS,
  NavigatorIOS,
  PushNotificationIOS,
  ScrollView,
  StatusBarIOS,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} = React;

// TODO: Bind

class LondonReact extends React.Component {
  async componentWillMount() {
    StatusBarIOS.setStyle('light-content');
    await this._registerInstallation();

    PushNotificationIOS.addEventListener('register', this._savePushToken);
    PushNotificationIOS.addEventListener('notification', this._notificationReceived);
    PushNotificationIOS.requestPermissions(this._savePushToken);
  }
  async _savePushToken(token) {
    await AsyncStorage.setItem('pushToken', token);
    await Parse.registerInstallation(token);
  }
  async _registerInstallation() {
    let pushToken = await AsyncStorage.getItem('pushToken');
    try {
      if (!pushToken) { throw new Error('No push token found'); }
      return await Parse.registerInstallation(pushToken);
    } catch (e) {
      AlertIOS.alert(`Unable to register installation. ${e}`);
    }
  }
  _notificationReceived(notification) {
    AlertIOS.alert(notification);
  }
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          component: CurrentMeetup,
          title: 'London React Meetup',
        }}
        tintColor="#7ed3f4"
        barTintColor="#1b1d24"
        titleTextColor="#ffffff"
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
      synopsis: dedent`
        React Native brings a whole new development process to mobile. We'll look at how to make use of some of the tooling built-in to React Native and how it can help you build your own apps.

        We'll explore the journey taken since React Native was open sourced in March, and demonstrate some of the ES6/ES7 features such as async/await that are now usable in React Native apps thanks to Babel transpilation built right into the packager.
      `,
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

// @PureRender / @Debug
class Date extends React.Component {
  _openCalendar() {
    LinkingIOS.openURL('calshow://');
  }
  render() {
    return (
      <TouchableOpacity onPress={this._openCalendar.bind(this)}>
        <View style={styles.section} onPress={this._openCalendar}>
          <StyledText style={styles.sectionTitle}>Date</StyledText>
          <StyledText>{this.props.date}</StyledText>
        </View>
      </TouchableOpacity>
    );
  }
}

class Venue extends React.Component {
  _openMaps() {
    LinkingIOS.openURL('http://maps.apple.com/?q=' + encodeURIComponent(`${this.props.name}, ${this.props.address}`));
  }
  render() {
    return (
      <TouchableOpacity onPress={this._openMaps.bind(this)}>
        <View style={styles.section}>
          <StyledText style={styles.sectionTitle}>Venue</StyledText>
          <StyledText>{this.props.name}</StyledText>
          <StyledText>{this.props.address}</StyledText>
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
            color="rgba(255, 255, 255, 0.8)"
            style={styles.icon}
          />}
          <StyledText style={styles.buttonText}>{this.props.text}</StyledText>
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
          <StyledText>{this.props.title}</StyledText>
          <View style={styles.bioContainer}>
            <View>
            <Image
              style={styles.bioPic}
              source={{uri: this.props.speaker.bioPic}}
            />
            </View>
            <StyledText style={styles.sectionTitle}>{this.props.speaker.name}</StyledText>
            <StyledText>{this.props.speaker.title}</StyledText>
            <StyledText style={styles.synopsis} numberOfLines={16}>{this.props.speaker.synopsis}</StyledText>
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
      <View style={[styles.section, {flex: 1}]}>
        <StyledText style={styles.sectionTitle}>Talks</StyledText>
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
        <View style={styles.talk}>
            <StyledText style={styles.talkTitle}>{speaker.talk}</StyledText>
            <StyledText>{speaker.name}</StyledText>
            <StyledText>{speaker.title}</StyledText>
        </View>
      </TouchableOpacity>
     );
  }
}

class Attending extends React.Component {
  render() {
    return (
      <View style={[styles.section, {borderBottomWidth: 0}]}>
        <StyledText>{this.props.count ? `${this.props.count} Attending` : 'Loading...'}</StyledText>
      </View>
    );
  }
}

class StyledText extends React.Component {
  render() {
    return (
      <Text {...this.props} style={[styles.text, this.props.style]}/>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1d24'
  },
  text: {
    color: 'white'
  },
  emptyPage: {
    flex: 1,
    paddingTop: 64,
    backgroundColor: '#1b1d24',
  },
  emptyPageText: {
    margin: 10,
  },
  section: {
    marginLeft: 20,
    marginRight: 20,
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#484848'
  },
  talk: {
    paddingTop: 20,
    paddingBottom: 10
  },
  sectionTitle: {
    fontSize: 20,
  },
  talkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bioContainer: {
    flex: 1,
    alignItems: 'center'
  },
  bioPic: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderColor: 'white',
    borderWidth: 3
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
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    borderLeftColor: 'rgba(255, 255, 255, 0.2)',
    padding: 5,
  },
  buttonText: {
    color: 'rgba(255, 255, 255, 0.8)'
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
