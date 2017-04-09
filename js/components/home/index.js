
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Header, Title, Content, Text, Button, Icon, Left, Body, Right, View } from 'native-base';
import { Footer, FooterTab } from 'native-base';
import BackgroundGeolocation from "react-native-background-geolocation";

import { openDrawer } from '../../actions/drawer';
import { setIndex } from '../../actions/list';
import styles from './styles';

import { GeolLocationFullList } from './screens/geolocationlogs';
import { GeoMainScreen } from './screens/geomainscreen';
import { GeoMap } from './screens/geomap';

export const POSITION_MSG = 0;
export const ERROR_MSG    = 1;

const {
  reset
} = actions;


class Home extends Component {

  watchID = null;

  options = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 100
  };

  state = {
    screen       : 'home',
    lastPosition : undefined,
    positionArray: []
  }

  static propTypes = {
    name: React.PropTypes.string,
    list: React.PropTypes.arrayOf(React.PropTypes.string),
    setIndex: React.PropTypes.func,
    openDrawer: React.PropTypes.func,
    pushRoute: React.PropTypes.func,
    reset: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

    onError(error) {
        alert(JSON.stringify(error));
        var type = error.type;
        var code = error.code;
        alert(type + " Error: " + code);
    }
    onActivityChange(activityName) {
        console.log('- Current motion activity: ', activityName);  // eg: 'on_foot', 'still', 'in_vehicle'
    }
    onProviderChange(provider) {
        console.log('- Location provider changed: ', provider.enabled);
    }
    onMotionChange(location) {
        console.log('- [js]motionchanged: ', JSON.stringify(location));
    }


  lPos  = (location) => this.setPostionToState(location)

  lError = (error) => this.addErrorToState(error)

  componentDidMount() {

    // this.watchID = navigator.geolocation.watchPosition(
    //   (position => this.setPostionToState(position)),
    //   (error) => this.addErrorToState(error),
    //   this.options
    // );

    BackgroundGeolocation.on('location', this.lPos);

    BackgroundGeolocation.on('error', this.lError);

    // BackgroundGeolocation.on('motionchange', this.onMotionChange);
    //
    // BackgroundGeolocation.on('activitychange', this.onActivityChange);
    //
    // BackgroundGeolocation.on('providerchange', this.onProviderChange);

    BackgroundGeolocation.configure({
      desiredAccuracy: 0,
      stationaryRadius: 25,
      distanceFilter: 10,
      stopTimeout: 1,
      debug: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: true,
      startOnBoot: false,
      },
      (state) => {
        // alert(JSON.stringify(state));
        console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);

        if (!state.enabled) {
          BackgroundGeolocation.start(function() {
            console.log("- Start success");
          });
        }
    });

  }

  componentWillUnmount() {
      // navigator.geolocation.clearWatch(this.watchID);

      BackgroundGeolocation.un('location', this.lPos);
      BackgroundGeolocation.un('error', this.lError);
      // BackgroundGeolocation.un('motionchange', this.onMotionChange);
      // BackgroundGeolocation.un('activitychange', this.onActivityChange);
      // BackgroundGeolocation.un('providerchange', this.onProviderChange);
  }

  addErrorToState(error) {
    let err  = error;
    err.type = ERROR_MSG;
    this.setState((prevState) => {
        let arr = prevState.positionArray
        arr.push(err);
        return { positionArray : arr };
    });
  }

  setPostionToState(position) {
    let lastPosition = position;
    lastPosition.type = POSITION_MSG;
    this.setState({ lastPosition });
    this.setState((prevState) => {
      let arr = prevState.positionArray
      if (!arr.find( (p) => p.timestamp === lastPosition.timestamp)) {
          arr.push(lastPosition);
      }
      return { positionArray : arr };
    });
  }

  switchScreenTo(name) {
    this.setState({ screen: name });
  }

  render() {
    let screen, title;
    const mapBottomMenuState = {
      home: false,
      map : false,
      list: false
    }
    switch(this.state.screen) {
      case 'list':
        screen = <GeolLocationFullList lastPosition={this.state.lastPosition} positionArray={this.state.positionArray} />;
        mapBottomMenuState.list = true;
        title = "My Log";
        break;
      case 'map':
        screen = <GeoMap lastPosition={this.state.lastPosition} positionArray={this.state.positionArray} />
        mapBottomMenuState.map = true;
        title = "Map";
        break;
      default:
        screen = <GeoMainScreen lastPosition={this.state.lastPosition} positionArray={this.state.positionArray} />
        mapBottomMenuState.home = true;
        title = "Home";
    }

    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.reset(this.props.navigation.key)}>
              <Icon active name="power" />
            </Button>
          </Left>
          <Body>
            <Title>
                {(this.props.name) ? this.props.name : title}
            </Title>
          </Body>
          <Right>
            <Button transparent onPress={this.props.openDrawer}>
              <Icon active name="menu" />
            </Button>
          </Right>
        </Header>
        <Content>
          {screen}
        </Content>
        <Footer >
          <FooterTab>
            <Button active={mapBottomMenuState.home} onPress={() => this.switchScreenTo('home')}>
              <Icon name="apps" />
              <Text>Home</Text>
            </Button>
            <Button active={mapBottomMenuState.list} onPress={() => this.switchScreenTo('list')} >
              <Icon name="list" />
              <Text>Log</Text>
            </Button>
            <Button active={mapBottomMenuState.map} last onPress={() => this.switchScreenTo('map')} >
              <Icon active name="map" />
              <Text>Map</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    setIndex: index => dispatch(setIndex(index)),
    openDrawer: () => dispatch(openDrawer()),
    reset: key => dispatch(reset([{ key: 'login' }], key, 0)),
  };
}

const mapStateToProps = state => ({
  name  : state.user.name,
  list  : state.list.list,
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(Home);
