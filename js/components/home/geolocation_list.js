import React, { Component } from 'react';
import { Text, List, ListItem } from 'native-base';

import { round } from './mathutils';

export class GeolLocationFullList extends Component {

  static propTypes = {
    lastPosition : React.PropTypes.object,
    positionArray: React.PropTypes.arrayOf(React.PropTypes.object)
  }

  render() {
    const lastPos = this.props.lastPosition,
          initPos = this.props.positionArray[0],
          posArr  = this.props.positionArray;

    return (
      <List>
        <ListItem itemDivider>
          <Text>Initial Position</Text>
        </ListItem>
        <ListItem>
          <Text>Timestamp: { initPos ? initPos.timestamp : '' }</Text>
        </ListItem>
        <ListItem>
          <Text> Long:{ initPos ? round(initPos.coords.longitude) : '' }</Text>
          <Text> Lat:{initPos ? round(initPos.coords.latitude) : '' } </Text>
          <Text> Speed:{initPos ? initPos.coords.speed : '' } </Text>
        </ListItem>
        <ListItem itemDivider>
          <Text>Last Position</Text>
        </ListItem>
        <ListItem>
          <Text>Timestamp: { lastPos ? lastPos.timestamp : '' }</Text>
        </ListItem>
        <ListItem>
          <Text> Long:{ lastPos ? round(lastPos.coords.longitude) : '' }</Text>
          <Text> Lat:{lastPos ? round(lastPos.coords.latitude) : '' } </Text>
          <Text> Speed:{lastPos ? lastPos.coords.speed : '' } </Text>
        </ListItem>

        {posArr.map((p) => {
          return (
            <ListItem key={p.timestamp}>
              <Text>{p.timestamp} >></Text>
              <Text>{round(p.coords.longitude)}, {round(p.coords.latitude)}, {p.coords.speed}</Text>
            </ListItem>
          );
        })}
      </List>
    );
  }

}
