
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Header, Title, Content, Text, Button, Icon, Left, Body, Right, View } from 'native-base';
import { Footer, FooterTab, Badge } from 'native-base';
import BackgroundGeolocation from "react-native-background-geolocation";

import { openDrawer } from '../../actions/drawer';
import { setIndex } from '../../actions/list';

import styles from './styles';

import { GeolLocationFullList } from './screens/geolocationlogs';
import { GeoMainScreen } from './screens/geomainscreen';
import { GeoMap } from './screens/geomap';
import uuidV4 from 'uuid/v4';

export const EVENT_TYPE = {
    "POSITION_MSG"      : 0,
    "ERROR_MSG"         : 1,
    "MOTION_CHANGE_MSG" : 2,
    "ACTIVITY_CHANGE"   : 3,
    "PROVIDER_CHANGE"   : 4,
    "START"             : 5
};

const {
  reset
} = actions;


class Home extends Component {

  state = {
    screen       : 'home',
    lastPosition : undefined,
    positionArray: [],
    isTracking   : false,
    uuidTracking : null
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


  lPos            = (location) => this.setPostionToState(location)

  lError          = (error) => this.addMsgToState(error, EVENT_TYPE.ERROR_MSG)

  lMotionChange   = (msg) => this.addMsgToState(msg, EVENT_TYPE.MOTION_CHANGE_MSG)

  lActivityChange = (msg) => this.addMsgToState({message: 'activity change:'+msg}, EVENT_TYPE.ACTIVITY_CHANGE)

  lProviderChange = (msg) => this.addMsgToState(msg, EVENT_TYPE.PROVIDER_CHANGE)

  lStart          = (msg) => {
    if (!state.enabled) {
      BackgroundGeolocation.start(function () {
        console.log("- Start success");
      });
    }
    this.addMsgToState(msg, EVENT_TYPE.START)
  }

  componentDidMount() {
    BackgroundGeolocation.on('location', this.lPos);
    BackgroundGeolocation.on('error', this.lError);
    BackgroundGeolocation.on('motionchange', this.lMotionChange);
    BackgroundGeolocation.on('activitychange', this.lActivityChange);
    BackgroundGeolocation.on('providerchange', this.lProviderChange);

    BackgroundGeolocation.configure({
      desiredAccuracy: 0,
      stationaryRadius: 25,
      distanceFilter: 10,
      stopTimeout: 1,
      debug: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: true,
      startOnBoot: false,
      preventSuspend : true,
      heartbeatInterval: 10
      }, function(state) {
        console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);
    });

  }

  componentWillUnmount() {
    BackgroundGeolocation.un('location', this.lPos);
    BackgroundGeolocation.un('error', this.lError);
    BackgroundGeolocation.un('motionchange', this.lMotionChange);
    BackgroundGeolocation.un('activitychange', this.lActivityChange);
    BackgroundGeolocation.un('providerchange', this.lProviderChange);
  }

  addMsgToState(message, type) {
    let msg      = message;
        msg.type = type;
    this.setState((prevState) => {
      msg.uuidV4Tracking = prevState.uuidTracking;
      let arr = prevState.positionArray;
      arr.unshift(msg);
      return { positionArray : arr };
    });
  }

  setPostionToState(position) {
    let lastPosition = position;
    lastPosition.type = EVENT_TYPE.POSITION_MSG;
    this.setState({ lastPosition });
    this.setState((prevState) => {
      lastPosition.uuidV4Tracking = prevState.uuidTracking;
      let arr = prevState.positionArray;
      if (!arr.find( (p) => p.timestamp === lastPosition.timestamp)) {
        arr.unshift(lastPosition);
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
        screen = (
          <GeolLocationFullList 
            lastPosition  = {this.state.lastPosition} 
            positionArray = {this.state.positionArray} />
        );
        mapBottomMenuState.list = true;
        title = "My Log";
        break;
      case 'map':
        screen = (
          <GeoMap 
            lastPosition  = {this.state.lastPosition} 
            positionArray = {this.state.positionArray} />
        );
        mapBottomMenuState.map = true;
        title = "Map";
        break;
      default:
        screen = (
          <GeoMainScreen 
            lastPosition  = {this.state.lastPosition} 
            positionArray = {this.state.positionArray} 
            isTracking    = {this.state.isTracking} 
            startTracking = {() => this.setState({isTracking: true, uuidTracking: uuidV4()})}
            stopTracking  = {() => this.setState({positionArray: [], isTracking: false, uuidTracking: null})} />
        );
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
              {title}
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
            <Button active={mapBottomMenuState.list} onPress={() => this.switchScreenTo('list')} badge>
              <Badge style={styles.footerBadge}>
                <Text>{this.state.positionArray.length}</Text>
              </Badge>
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
