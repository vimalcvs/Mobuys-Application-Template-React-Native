import React, { Component } from 'react';
import { Footer, FooterTab, Button, Icon } from 'native-base';
import getStyles from '../../assets/styles';
const styles = getStyles();


export default class FooterPage extends Component {
  render() {
    return (
      
        <Footer >
          <FooterTab style = {styles.bgprm}> 
            <Button>
              <Icon name="apps" />
            </Button>
            <Button>
              <Icon name="camera" type="FontAwesome"/>
            </Button>
            <Button >
              <Icon active name="navicon" type="FontAwesome"/>
            </Button>
            <Button>
              <Icon name="user" type="FontAwesome"/>
            </Button>
          </FooterTab>
        </Footer>
     
    );
  }
}