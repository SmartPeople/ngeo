import React, { Component } from 'react';
import Dimensions from 'Dimensions';

import MapView from 'react-native-maps';

export class GeoMap extends Component {

    static propTypes = {
        lastPosition : React.PropTypes.object,
        positionArray: React.PropTypes.arrayOf(React.PropTypes.object)
    }

    render() {
        const lastPos = this.props.lastPosition;
        return (
            <MapView
                style={{height: Dimensions.get('window').height, width: Dimensions.get('window').width}}
                region={{
                    latitude: lastPos.coords.latitude,
                    longitude: lastPos.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            />
        );
    }

}
