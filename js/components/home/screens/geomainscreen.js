import React, { Component } from 'react';
import { Text, Icon, Button } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import styles from '../styles';
import { round } from '../mathutils';

export class GeoMainScreen extends Component {

  static propTypes = {
    lastPosition : React.PropTypes.object,
    positionArray: React.PropTypes.arrayOf(React.PropTypes.object)
  }

  state = {
    isKmph: false
  }

  getSpeed(speed) {
    const relSpeed = round((this.state.isKmph ? speed * 3.6 : speed));
    return relSpeed + ' ' + (this.state.isKmph ? 'km/h' : 'm/s');
  }

  toggleSpeedType() {
    this.setState({isKmph: !this.state.isKmph});
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
              <Text style={styles.param}> { lastPos ? new Date(lastPos.timestamp).toISOString() : '' }</Text>
            <Text style={styles.label}> Timestamp:</Text>
            <Text style={styles.param}> { lastPos ? lastPos.timestamp : '' }</Text>
          </Col>
        </Row>
      </Grid>
    );
  }

}
