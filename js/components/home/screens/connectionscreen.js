import React, { Component } from 'react';
import { Text, Icon, Button, Badge } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import styles from '../styles';
import { round } from '../../../utils/mathutils';
import { EVENT_TYPE } from '../../../services/geo_service';

export class ConnectionScreen extends Component {

  static propTypes = {
    connInfo     : React.PropTypes.object,
    positionArray: React.PropTypes.array
  }

  convertTraffic(val) {
    if( val >= 1073741824) {
      return "" + round(val/1073741824) + " Gb"
    } else if( val >= 1048576) {
      return "" + round(val/1048576)    + " Mb"
    } else if( val >= 1024) {
      return "" + round(val/1024)       + " Kb"
    }  else {
      return "" + val + " b"
    }
  }

  timestamptoDate(ts) {
    return (new Date(ts)).toISOString();
  }

  getTotalEvents() {
    return this.props.positionArray.length;
  }

  getNunEvents(event_type) {
    return this.props.positionArray.filter((p) => p.type === event_type).length;
  }

  render() {
    const connInfo = this.props.connInfo;
    return (
      <Grid>
        <Row style={styles.row}>
          <Col size={20}><Icon active name="pulse" style={styles.icon} /></Col>
          <Col size={80}>
            <Text style={styles.label}> URL:</Text>
            <Text style={styles.param}> {connInfo.url}</Text>
            <Text style={styles.label}> Connection time:</Text>
            <Text style={styles.param}> {this.timestamptoDate(connInfo.connTime)}</Text>
            <Text style={styles.label}> Status</Text>
            <Text style={styles.param}> {connInfo.status}</Text>
            <Text style={styles.label}> Last state:</Text>
            <Text style={styles.param}> {connInfo.last_state}</Text>
          </Col>
        </Row>
        <Row style={styles.row}>
          <Col size={20}><Icon active name="flash" style={styles.icon} /></Col>
          <Col size={40}>
            <Text style={styles.label}> Traffic:</Text>
            <Text style={styles.param}> Out: {this.convertTraffic(connInfo.traffic.outbound)}</Text>
            <Text style={styles.param}> In   : {this.convertTraffic(connInfo.traffic.inbound)}</Text>
          </Col>
          <Col size={40}>
            <Text style={styles.label}> Ping/Queue:</Text>
            <Text style={styles.param}> {connInfo.ping_number} ms/{connInfo.queue_length}</Text>
          </Col>
        </Row>
        <Row style={styles.row}>
          <Col size={20}><Icon active name="sync" style={styles.icon} /></Col>
          <Col size={40}>
            <Text style={styles.label}> # Events:</Text>
            <Text style={styles.param}> {this.getTotalEvents()}</Text>
            <Text style={styles.label}> # Positions:</Text>
            <Text style={styles.param}> {this.getNunEvents(EVENT_TYPE.POSITION_MSG)}</Text>
            <Text style={styles.label}> # Motions:</Text>
            <Text style={styles.param}> {this.getNunEvents(EVENT_TYPE.MOTION_CHANGE_MSG)}</Text>
          </Col>
          <Col size={40}>
            <Text style={styles.label}> # Errors/Starts:</Text>
            <Text style={styles.param}> {this.getNunEvents(EVENT_TYPE.ERROR_MSG)}/{this.getNunEvents(EVENT_TYPE.START)}</Text>
            <Text style={styles.label}> # Activities:</Text>
            <Text style={styles.param}> {this.getNunEvents(EVENT_TYPE.ACTIVITY_CHANGE)}</Text>
            <Text style={styles.label}> # Providers:</Text>
            <Text style={styles.param}> {this.getNunEvents(EVENT_TYPE.PROVIDER_CHANGE)}</Text>
          </Col>
        </Row>
      </Grid>

    );
  }

}