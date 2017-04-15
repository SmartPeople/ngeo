import { Alert } from 'react-native';
import BackgroundGeolocation from "react-native-background-geolocation";

import React, { Component } from 'react';
import { Text, Icon, Button, Badge } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import styles from '../styles';
import { round } from '../mathutils';

export class GeoMainScreen extends Component {

  static propTypes = {
    lastPosition  : React.PropTypes.object,
    positionArray : React.PropTypes.arrayOf(React.PropTypes.object),
    isTracking    : React.PropTypes.bool,
    startTracking : React.PropTypes.func,
    stopTracking  : React.PropTypes.func
  }

  state = {
    isKmph : false
  }

  getSpeed(speed) {
    let relSpeed = speed < 0 ? 0 : speed;
    relSpeed = round((this.state.isKmph ? relSpeed * 3.6 : relSpeed));
    return relSpeed + ' ' + (this.state.isKmph ? 'km/h' : 'm/s');
  }

  toggleSpeedType() {
    this.setState({isKmph: !this.state.isKmph});
  }
  
  startTracking() {
    this.props.startTracking();
    BackgroundGeolocation.start(() => console.log("- Start success"));
  }

  stopTracking() {
    Alert.alert(
      'Tracking',
      'Are you sure?',
      [
        {
          text: 'OK', 
          onPress: () => {
            BackgroundGeolocation.stop(() => console.log("- Stop success"));
            this.props.stopTracking();
          }
        },
        {
          text: 'Cancel', 
          onPress: () => console.log('Cancel Pressed'), 
          style: 'cancel'
        }
      ]
    );
  }

  render() {
    const lastPos = this.props.lastPosition;
    return (
      <Grid>
        <Row style={styles.row}>
          <Col size={20}><Icon active name="map" style={styles.icon} /></Col>
          <Col size={80}>
            <Text style={styles.label}> Latitude</Text>
            <Text style={styles.param}> {lastPos ? lastPos.coords.latitude : '' }&#176;</Text>
            <Text style={styles.label}> Longitude</Text>
            <Text style={styles.param}> { lastPos ? lastPos.coords.longitude : '' }&#176;</Text>
            <Text style={styles.label}> Altitude</Text>
            <Text style={styles.param}> {lastPos ? round(lastPos.coords.altitude) : '' } m </Text>
            <Text style={styles.label}> Accuracy:</Text>
            <Text style={styles.param}> { lastPos ? round(lastPos.coords.accuracy) : '' } m</Text>
          </Col>
        </Row>
        <Row style={styles.row}>
          <Col size={20}>
            <Icon active name="speedometer" style={styles.icon} />
          </Col>
          <Col size={80}>
            <Text style={styles.label} onPress={() => this.toggleSpeedType()}> Speed:</Text>
            <Text style={styles.param} onPress={() => this.toggleSpeedType()}> {lastPos ? this.getSpeed(lastPos.coords.speed) : '' } <Text style={styles.smallNote}>(GEO)</Text></Text>
            <Text style={styles.param} onPress={() => this.toggleSpeedType()}> {lastPos ? this.getSpeed(lastPos.coords.speed) : '' } <Text style={styles.smallNote}>(AVG)</Text></Text>
            <Text style={styles.param} onPress={() => this.toggleSpeedType()}> {lastPos ? this.getSpeed(lastPos.coords.speed) : '' } <Text style={styles.smallNote}>(LATEST)</Text></Text>
          </Col>
        </Row>
        <Row style={styles.row}>
          <Col size={20}>
            <Icon active name="time" style={styles.icon} />
          </Col>
          <Col size={80}>
            <Text style={styles.label}> DateTime:</Text>
              <Text style={styles.param}> { lastPos ? lastPos.timestamp : '' }</Text>
            <Text style={styles.label}> UUID:</Text>
            <Text style={styles.uuid}> { lastPos ? lastPos.uuid : '' }</Text>
          </Col>
        </Row>
        <Row style={styles.row}>
          <Col size={100}>
          {this.props.isTracking ? (
            <Button onPress={() => this.stopTracking() } block danger bordered style={styles.trackingButton} badge>
              <Text>Stop Tracking</Text>
            </Button>
          ) : (
            <Button onPress={() => this.startTracking() } block success bordered style={styles.trackingButton}>
              <Text>Start Tracking</Text>
            </Button>
          )}
          </Col>
        </Row>
      </Grid>
    );
  }

}
