import React, { Component } from 'react';
import {Header,Left, Body, Right,Icon, Button, Title } from 'native-base';
import {Alert,BackHandler,AsyncStorage} from 'react-native';
import {Actions} from 'react-native-router-flux';

export default class HeaderPage extends Component {
    _showDrawer() {Actions.drawerOpen()}
    _ex_app = async () => {
      await AsyncStorage.clear();
      BackHandler.exitApp() ;
    }
    _exitapplication () { 
      Alert.alert(
        "Exit App",
        "Do you want to exit?",
        [
          {
            text: "No",
            onPress: () =>{}
          },
          { text: "Yes", 
            onPress: () => {
               this._ex_app();
            }
        }
        ],
        { cancelable: false }
        );
      
    }
    render(){
        return(
          <Header style={{backgroundColor: '#f15a23'}}>
           <Left>
                <Button transparent onPress={this._showDrawer}>
                  <Icon name='apps' />
                </Button>
              </Left>
              <Body>
                <Title>MOBUYS</Title>
              </Body>
              <Right>
                <Button transparent  onPress={() => Actions.Home()}>
                  <Icon name='home' />
                </Button>
                <Button transparent onPress={() => this._exitapplication()}>
                  <Icon name='power' />
                </Button>
              </Right>
         </Header>
        );
  }
}