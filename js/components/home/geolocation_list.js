import React, { Component } from 'react';
import { Text, List, ListItem } from 'native-base';

function round(ts) {
  return Math.round(ts * 100) / 100;
}

export class GeolLocationFullList extends Component {

  state = {
    initialPosition : undefined,
    lastPosition    : undefined,
    positionArray   : []
  };

  watchID = null;

  componentDidMount() {

    navigator.geolocation.getCurrentPosition(
      (position) => {
        let initialPosition = position;
        this.setState({ initialPosition });
      },
      error => alert(JSON.stringify(error)),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    this.watchID = navigator.geolocation.watchPosition((position) => {
      let lastPosition = position;
      this.setState({ lastPosition });
      this.setState((prevState) => {
        let arr = prevState.positionArray
        arr.push(lastPosition);
        return { positionArray : arr };
      });

    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    let initPos = this.state.initialPosition,
        lastPos = this.state.lastPosition,
        posArr  = this.state.positionArray;
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
