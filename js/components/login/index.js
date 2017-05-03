
import React, { Component } from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Item, Input, Button, Icon, View, Text } from 'native-base';

import { setUser } from '../../actions/user';
import styles from './styles';

const {
  replaceAt,
} = actions;

const background = require('../../../images/s.png');

class Login extends Component {

  url = 'http://localhost:4000/api/login';

  static propTypes = {
    setUser: React.PropTypes.func,
    replaceAt: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  constructor(props) {
    super(props);
    this.state = {
      email      : '',
      password   : '',
      invalidate : false
    };
  }

  setUser(name, token) {
    this.props.setUser(name, token);
  }

  replaceRoute(route) {
    this.setState({invalidate: false});

    //TODO: Move to the separate service?
    fetch(this.url, {
      method: 'POST',
      headers: {
        'Accept'      : 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state)
    }).then((response) => {
      return response.json();
    }).then((json) => {
      if ( json['user']) {
        this.setUser(this.state.email, json['token']);
        this.props.replaceAt('login', { key: route }, this.props.navigation.key);
      } else {
        this.setState({invalidate: true});
      }
      return json;
    }).catch((error) => {
      alert(JSON.stringify(error, null, 2));
      this.setState({invalidate: true});
      return error;
    });

  }

  render() {
    return (
      <Container>
        <View style={styles.container}>
          <Content>
            <Image source={background} style={styles.shadow}>
              <View style={styles.bg}>
                <Item style={styles.input} floatingLabel error={this.state.invalidate}>
                  <Icon active name="person" />
                  <Input 
                    placeholder="EMAIL" 
                    onChangeText={email => this.setState({ email })} 
                  />
                </Item>
                <Item style={styles.input} floatingLabel error={this.state.invalidate}>
                  <Icon name="unlock" />
                  <Input
                    placeholder="PASSWORD"
                    secureTextEntry
                    onChangeText={password => this.setState({ password })}
                  />
                </Item>
                <Button style={styles.btn} onPress={() => this.replaceRoute('home')}>
                  <Text>Login</Text>
                </Button>
              </View>
            </Image>
          </Content>
        </View>
      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    setUser: (name, token) => dispatch(setUser(name, token)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindActions)(Login);
