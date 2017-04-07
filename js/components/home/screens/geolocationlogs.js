import React, { Component } from 'react';
import { Text, List, ListItem } from 'native-base';
import { POSITION_MSG } from '../index';
import { round, extractLast4 } from '../mathutils';


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
    const msg = p.message.split(100);
    return (
        <Text>{msg}...</Text>
    )
}

function line(p) {
    return p.type === POSITION_MSG ? geoLine(p) : errorLine(p);
}

function AlertJson(p) {
    alert(JSON.stringify(p, null, 2));
}

export class GeolLocationFullList extends Component {

  static propTypes = {
    lastPosition : React.PropTypes.object,
    positionArray: React.PropTypes.arrayOf(React.PropTypes.object)
  }

  render() {
    return (
      <List
        dataArray = {this.props.positionArray}
        renderRow = { (p) =>
          <ListItem key={p.timestamp} button onPress={() => { AlertJson(p) }}>
            {line(p)}
          </ListItem>
        }
      ></List>
    );
  }

}
