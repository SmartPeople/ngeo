import React, { Component } from 'react';
import Dimensions from 'Dimensions';

import MapView from 'react-native-maps';
import { Button, Text, View } from 'native-base';
import { EVENT_TYPE } from '../../../services/geo_service';

export class GeoMap extends Component {

  static LATITUDE_DELTA  = 0.0922;
  static LONGITUDE_DELTA = 0.0421;

  state = {
    jumpToLast : false
  }

  static propTypes = {
    positionArray: React.PropTypes.arrayOf(React.PropTypes.object)
  }

  getPositions() {
    return this.props.positionArray.filter((p) => p.type === EVENT_TYPE.POSITION_MSG);
  }

  getInitialPosition() {
    const poss = this.getPositions();
    return poss.length > 0 ? this.getPositions()[poss.length-1] : undefined;
  }

  getLastPosition() {
    return this.getPositions()[0];
  }

  getColor(indx) {
    switch(indx){
      case 0:
        return 'red';
      case this.getPositions().length - 1:
        return 'blue';
      default:
        return 'lightgray'
    }
  }

  render() {
    let initPost   = this.getInitialPosition(),
        positionTo = null;

    if(initPost) {
      const posArr  = this.getPositions(),
            lastPos = this.getLastPosition();
      
      if(this.state.jumpToLast) {
        positionTo = this.getLastPosition().coords;
        positionTo.latitudeDelta  = GeoMap.LATITUDE_DELTA/25;
        positionTo.longitudeDelta = GeoMap.LONGITUDE_DELTA/25;
        this.setState({jumpToLast: false});
      }

      return (
        <View style={{position: 'relative'}}>
          <MapView
            style = {{ 
              height: Dimensions.get('window').height,
              width : Dimensions.get('window').width
            }}
            initialRegion = {{
              latitude      : initPost.coords.latitude,
              longitude     : initPost.coords.longitude,
              latitudeDelta : GeoMap.LATITUDE_DELTA,
              longitudeDelta: GeoMap.LONGITUDE_DELTA
            }}
            region = {positionTo}
          >
            {posArr.map((marker, indx) => (
              <MapView.Marker 
                key         = {marker.timestamp}
                coordinate  = {marker.coords}
                title       = {marker.timestamp.toString()}
                description = {marker.coords.speed.toString()}
                pinColor    = {this.getColor(indx)}
              />
            ))}
          </MapView>
          <Button onPress = {() => this.setState({jumpToLast: true})}
              style={{
                position : 'absolute',
                top      : Dimensions.get('window').height - 170,
                left     : 10,
                textAlign: 'center'
              }}
              >
              <Text>To Last</Text>
          </Button>
        </View>
        );
    } else {
      return null;
    }
  }
}
