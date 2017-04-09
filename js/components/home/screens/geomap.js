import React, { Component } from 'react';
import Dimensions from 'Dimensions';

import MapView from 'react-native-maps';
import { POSITION_MSG } from '../index';


export class GeoMap extends Component {

    static propTypes = {
        lastPosition : React.PropTypes.object,
        positionArray: React.PropTypes.arrayOf(React.PropTypes.object)
    }

    render() {
        let lastPos = this.props.lastPosition;
        const posArr = this.props.positionArray.filter((p) => p.type === POSITION_MSG);
        alert(lastPos);
        alert(posArr);
        if(!lastPos) {
            lastPos = {
                coords : {
                    latitude: -34.397,
                    longitude : 150.644
                }
            }
        }
        return (
            <MapView
                style={{height: Dimensions.get('window').height, width: Dimensions.get('window').width}}
                region={{
                    latitude: lastPos.coords.latitude,
                    longitude: lastPos.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {posArr.map(marker => (
                    <MapView.Marker key={marker.timestamp}
                        coordinate={marker.coords}
                        title={marker.timestamp.toString()}
                        description={marker.coords.speed.toString()}
                    />
                ))}
            </MapView>
        );
    }

}
