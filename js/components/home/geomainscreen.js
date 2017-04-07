import React, { Component } from 'react';
import { Text, List, ListItem, Icon } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import styles from './styles';

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
                <Row style={styles.row}>
                    <Col size={20}><Icon active name="map" style={styles.icon} /></Col>
                    <Col size={80}>
                        <Text style={styles.label}> Latitude</Text>
                        <Text style={styles.param}> {lastPos ? lastPos.coords.latitude : '' }&#176;</Text>
                        <Text style={styles.label}> Longitude</Text>
                        <Text style={styles.param}> { lastPos ? lastPos.coords.longitude : '' }&#176;</Text>
                        <Text style={styles.label}> Altitude</Text>
                        <Text style={styles.param}> {lastPos ? lastPos.coords.altitude : '' } m ({lastPos ? lastPos.coords.altitudeAccuracy : '' }m) </Text>
                        <Text style={styles.label}> Accuracy:</Text>
                        <Text style={styles.param}> { lastPos ? lastPos.coords.accuracy : '' } git m</Text>
                    </Col>
                </Row>
                <Row style={styles.row}>
                    <Col size={20}>
                        <Icon active name="speedometer" style={styles.icon} />
                    </Col>
                    <Col size={80}>
                        <Text style={styles.label}> Speed:</Text>
                        <Text style={styles.param}> {lastPos ? lastPos.coords.speed : '' } m/s <Text style={styles.smallNote}>(GEO)</Text></Text>
                        <Text style={styles.param}> {lastPos ? lastPos.coords.speed : '' } m/s <Text style={styles.smallNote}>(AVG)</Text></Text>
                        <Text style={styles.param}> {lastPos ? lastPos.coords.speed : '' } m/s <Text style={styles.smallNote}>(LATEST)</Text></Text>
                    </Col>
                </Row>
                <Row style={styles.row}>
                    <Col size={20}>
                        <Icon active name="time" style={styles.icon} />
                    </Col>
                    <Col size={80}>
                        <Text style={styles.label}> DateTime:</Text>
                        <Text style={styles.param}> { new Date().toISOString() }</Text>
                        <Text style={styles.label}> Timestamp:</Text>
                        <Text style={styles.param}> { lastPos ? lastPos.timestamp : '' }</Text>
                    </Col>
                </Row>
            </Grid>
        );
    }

}
