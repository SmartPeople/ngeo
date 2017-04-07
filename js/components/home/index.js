
import React, { Component } from 'react';
// import { TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Header, Title, Content, Text, Button, Icon, Left, Body, Right, View } from 'native-base';
import { Footer, FooterTab } from 'native-base';

import { openDrawer } from '../../actions/drawer';
import { setIndex } from '../../actions/list';
import styles from './styles';

import { GeolLocationFullList } from './geolocation_list';
import { GeoMainScreen } from './geomainscreen';


const {
  reset,
  pushRoute,
} = actions;


class Home extends Component {

  state = {
    screen: 'home'
  }

  static propTypes = {
    name: React.PropTypes.string,
    list: React.PropTypes.arrayOf(React.PropTypes.string),
    setIndex: React.PropTypes.func,
    openDrawer: React.PropTypes.func,
    pushRoute: React.PropTypes.func,
    reset: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  pushRoute(route, index) {
    this.props.setIndex(index);
    this.props.pushRoute({ key: route, index: 1 }, this.props.navigation.key);
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.reset(this.props.navigation.key)}>
              <Icon active name="power" />
            </Button>
          </Left>

          <Body>
            <Title>{(this.props.name) ? this.props.name : 'Home'}</Title>
          </Body>

          <Right>
            <Button transparent onPress={this.props.openDrawer}>
              <Icon active name="menu" />
            </Button>
          </Right>
        </Header>

        <Content>
          {/*<GeolLocationFullList />*/}
          <GeoMainScreen/>
        </Content>

        <Footer >
          <FooterTab>
            <Button active={true} onPress={this.props.changeScreen}>
              <Icon name="apps" />
              <Text>Home</Text>
            </Button>
            <Button>
              <Icon name="list" onPress={this.props.changeScreen} />
              <Text>Log</Text>
            </Button>
            <Button last>
              <Icon active name="map" />
              <Text>Map</Text>
            </Button>
          </FooterTab>
        </Footer>

      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    setIndex: index => dispatch(setIndex(index)),
    openDrawer: () => dispatch(openDrawer()),
    pushRoute: (route, key) => dispatch(pushRoute(route, key)),
    reset: key => dispatch(reset([{ key: 'login' }], key, 0)),
  };
}

const mapStateToProps = state => ({
  name  : state.user.name,
  list  : state.list.list,
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(Home);
