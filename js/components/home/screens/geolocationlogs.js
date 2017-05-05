import React, { Component } from 'react';
import { Text, List, ListItem, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { EVENT_TYPE } from '../../../services/geo_service';
import { round, extractLast4 } from '../../../utils/mathutils';
import styles from '../styles';

function geoLine(p) {
  return (
    <Text>
      ..{extractLast4(p.timestamp)}&nbsp;
      ..{extractLast4(p.coords.latitude)}&#176;&nbsp;
      ..{extractLast4(p.coords.longitude)}&#176;&nbsp;
      {round(p.coords.altitude)}m&nbsp;
      {round(p.coords.accuracy)}m&nbsp;
      {round(p.coords.speed)}m/s
    </Text>
  )
}

function errorLine(p) {
  const msg = (p.message ? p.message : JSON.stringify(p)).slice(0, 40);
  return (
    <Text>{msg}...</Text>
  )
}

function line(p) {
  return p.type === EVENT_TYPE.POSITION_MSG ? geoLine(p) : errorLine(p);
}

function AlertJson(p) {
  alert(JSON.stringify(p, null, 2));
}

export class GeolLocationFullList extends Component {

  static propTypes = {
    lastPosition : React.PropTypes.object,
    positionArray: React.PropTypes.arrayOf(React.PropTypes.object)
  }

  getTotalEvents() {
    return this.props.positionArray.length;
  }

  getNunEvents(event_type) {
    return this.props.positionArray.filter((p) => p.type === event_type).length;
  }

  render() {
    return (
      <Grid>
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
        <Row style={styles.row}>
          <Col size={100}>
            <List
              dataArray = {this.props.positionArray}
              renderRow = { (p) =>
                <ListItem key={p.timestamp} button onPress={() => { AlertJson(p) }}>
                  {line(p)}
                </ListItem>
              }
            ></List>
          </Col>
        </Row>
      </Grid>
    );
  }

}
