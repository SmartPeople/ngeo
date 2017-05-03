import { Alert } from 'react-native';
import BackgroundGeolocation from "react-native-background-geolocation";

import React, { Component } from 'react';
import { Text, Icon, Button, Badge } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import styles from '../styles';
import { round, getSomeSpeed, getDistance } from '../../../utils/mathutils';
import { GeoService, EVENT_TYPE } from '../../../services/geo_service';

export class GeoMainScreen extends Component {

  static propTypes = {
    lastPosition  : React.PropTypes.object,
    positionArray : React.PropTypes.arrayOf(React.PropTypes.object),
    isTracking    : React.PropTypes.bool,
    startTracking : React.PropTypes.func,
    stopTracking  : React.PropTypes.func
  }

  state = {
    isKmph : true
  }

  getSpeedMetricks() {
    return this.state.isKmph ? 'km/h' : 'm/s';
  }

  getSpeed(speed) {
    let relSpeed = speed < 0 ? 0 : speed;
    relSpeed = round((this.state.isKmph ? relSpeed * 3.6 : relSpeed));
    return relSpeed + ' ' + this.getSpeedMetricks();
  }

  filteredArray() {
    return this.props
               .positionArray
               .filter((p) => p.type === EVENT_TYPE.POSITION_MSG);
  }

  getGeoSpeed() {
    const filtered = this.filteredArray(),
          arrayLength = filtered.length;
    return getSomeSpeed(filtered, 1, 0);
  }

  getAvgSpeed() {
    const filtered    = this.filteredArray(),
          arrayLength = filtered.length;
    return getSomeSpeed(filtered, filtered.length - 1, 0);
  }

  getDistance() {
    return getDistance(this.filteredArray());
  }

  toggleSpeedType() {
    this.setState({isKmph: !this.state.isKmph});
  }
  
  startTracking() {
    this.props.startTracking();
    GeoService.start();
  }

  stopTracking() {
    Alert.alert(
      'Tracking',
      'Are you sure?',
      [
        {
          text: 'OK', 
          onPress: () => {
            GeoService.stop();
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
          <Col size={50}>
            <Text style={styles.label} onPress={() => this.toggleSpeedType()}> Speed:</Text>
            <Text style={styles.param} onPress={() => this.toggleSpeedType()}> {lastPos ? this.getSpeed(lastPos.coords.speed) : '' } <Text style={styles.smallNote}>(GEO)</Text></Text>
            <Text style={styles.param} onPress={() => this.toggleSpeedType()}> {lastPos ? this.getAvgSpeed() : '' } <Text style={styles.smallNote}>(AVG)</Text></Text>
            <Text style={styles.param} onPress={() => this.toggleSpeedType()}> {lastPos ? this.getGeoSpeed() : '' } <Text style={styles.smallNote}>(LATEST)</Text></Text>
          </Col>
          <Col size={30}>
            <Text style={styles.label}> Distance:</Text>
            <Text style={styles.param}> {lastPos ? this.getDistance() : '' }</Text>
            <Text style={styles.label}> # of Events:</Text>
            <Text style={styles.param}> {this.props.positionArray.length}</Text>
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