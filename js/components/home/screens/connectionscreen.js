import React, { Component } from 'react';
import { Text, Icon, Button, Badge } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import styles from '../styles';
import { round } from '../../../utils/mathutils';

export class ConnectionScreen extends Component {

  static propTypes = {
    connInfo : React.PropTypes.object
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

  render() {
    const connInfo = this.props.connInfo;
    return (
      <Grid>
        <Row style={styles.row}>
          <Col size={20}><Icon active name="pulse" style={styles.icon} /></Col>
          <Col size={80}>
            <Text style={styles.label}> URL:</Text>
            <Text style={styles.param}> {connInfo.url}</Text>
            <Text style={styles.label}> Queue Length</Text>
            <Text style={styles.param}> {connInfo.queue_length}</Text>
            <Text style={styles.label}> Status</Text>
            <Text style={styles.param}> {connInfo.status}</Text>
            <Text style={styles.label}> Ping:</Text>
            <Text style={styles.param}> {connInfo.ping_number} ms</Text>
            <Text style={styles.label}> Last state:</Text>
            <Text style={styles.param}> {connInfo.last_state}</Text>
            <Text style={styles.label}> Connection time:</Text>
            <Text style={styles.param}> {this.timestamptoDate(connInfo.connTime)}</Text>
            <Text style={styles.label}> Traffic:</Text>
            <Text style={styles.param}> Out: {this.convertTraffic(connInfo.traffic.outbound)}</Text>
            <Text style={styles.param}> In   : {this.convertTraffic(connInfo.traffic.inbound)}</Text>
          </Col>
        </Row>
      </Grid>

    );
  }

}