
import React, { Component } from 'react';
import { Linking } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Header, Title, Content, Text, Button, Icon, Left, Right, Body } from 'native-base';

import { List, ListItem, H1 } from 'native-base';

import { openDrawer } from '../../actions/drawer';
import styles from './styles';

const {
  popRoute,
} = actions;

aStyle = {
  color         : '#1a0dab',
  textDecoration: 'underline',
  cursor        : 'pointer'
};

const Link = (props) => {
  const fireLink = () => {
    Linking.canOpenURL(props.url).then(supported => {
      if (supported) {
        Linking.openURL(props.url);
      } else {
        alert('Don\'t know how to open URI: ' + props.url);
      }
    });
  };

  return (<Text onPress={() => fireLink() } style={aStyle}>{props.children}</Text>);
}

class BlankPage extends Component {

  static propTypes = {
    title: React.PropTypes.string,
    name: React.PropTypes.string,
    index: React.PropTypes.number,
    list: React.PropTypes.arrayOf(React.PropTypes.string),
    openDrawer: React.PropTypes.func,
    popRoute: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  popRoute() {
    this.props.popRoute(this.props.navigation.key);
  }

  render() {
    const { props: { name, index, list } } = this;
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.popRoute()}>
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>

          <Body>
            <Title>{(this.props.title) ? this.props.title : 'Blank Page'}</Title>
          </Body>

          <Right>
            <Button transparent onPress={this.props.openDrawer}>
              <Icon name="ios-menu" />
            </Button>
          </Right>
        </Header>

        <Content padder>
          <H1 style={{marginLeft:14}}>List of main libraries</H1>
          <List>
            <ListItem>
              <Text>React Native: <Link url="https://facebook.github.io/react-native/">https://facebook.github.io/react-native/</Link></Text>
            </ListItem>
            <ListItem>
              <Text>Icons made by Pixel Buddha from www.flaticon.com is licensed by CC 3.0 BY</Text>
            </ListItem>
          </List>
          <ListItem>
            <Text>React Native Starter Kit: <Link url="https://github.com/start-react/native-starter-kit">https://github.com/start-react/native-starter-kit</Link></Text>
          </ListItem>
          <ListItem>
            <Text>React Native Map: <Link url="https://github.com/airbnb/react-native-maps">https://github.com/airbnb/react-native-maps</Link></Text>
          </ListItem>
          <ListItem>
            <Text>React Native Background Geolocation: <Link url="https://github.com/transistorsoft/react-native-background-geolocation">https://github.com/transistorsoft/react-native-background-geolocation</Link></Text>
          </ListItem>
          <List>
          </List>
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    popRoute: key => dispatch(popRoute(key)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  name: state.user.name,
  index: state.list.selectedIndex,
  list: state.list.list,
});


export default connect(mapStateToProps, bindAction)(BlankPage);
