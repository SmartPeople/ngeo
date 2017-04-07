import React, { Component } from 'react';
import { Text, List, ListItem, Icon } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";

function round(ts) {
    return Math.round(ts * 100) / 100;
}

export class GeoMainScreen extends Component {

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
            <Grid>
                <Row>
                    <Col size={20}><Icon active name="map" style={{textAlign:"right"}} /></Col>
                    <Col size={80}>
                        <Text> Long:{ lastPos ? lastPos.coords.longitude : '' }</Text>
                        <Text> Lat:{lastPos ? lastPos.coords.latitude : '' } </Text>
                        <Text> Altitude: {lastPos ? lastPos.coords.altitude : '' } ({lastPos ? lastPos.coords.altitudeAccuracy : '' }) </Text>
                        <Text> Accuracy:{ lastPos ? lastPos.coords.accuracy : '' }</Text>
                    </Col>
                </Row>
                <Row>
                    <Col size={20}><Icon active name="speedometer" style={{textAlign:"right"}}  /></Col>
                    <Col size={80}><Text> Speed:{lastPos ? lastPos.coords.speed : '' } | Avg | lates</Text></Col>

                </Row>
                <Row>
                    <Col size={20}><Icon active name="time"  style={{textAlign:"right"}}  /></Col>
                    <Col size={80}>
                        <Row>
                            <Text> { new Date().toISOString() }</Text>
                        </Row>
                        <Row>
                            <Text> { lastPos ? lastPos.timestamp : '' }</Text>
                        </Row>
                    </Col>
                </Row>
            </Grid>
        );
    }

}
