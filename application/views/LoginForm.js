import React, { Component } from 'react';
import getStyles from '../../assets/styles';
import getTheme from '../../native-base-theme/components';
import commonColor from '../../native-base-theme/variables/commonColor';
import { Container, Content, Form, Item, Input,Icon,Button,Text, View,StyleProvider  } from 'native-base';
import {Actions} from 'react-native-router-flux';
import {GetDataRegsLenght,GetPersonByLogin} from '../models/allSchemas';
import {AsyncStorage} from 'react-native';

const styles = getStyles();

export default class FormLogin extends Component {
    constructor(props) {
        super(props);
         this.state = {
            username:'',
            userpass:'',
            okmang:'',
        }
        GetDataRegsLenght().then((regis) => {
            //window.console.log(regis);
            if (regis <= 0)
            {

                Actions.Mainpage();  
            }
            
        }).catch((error) => {
           alert('ERROR');
           Actions.Mainpage();
        });
    }
   _storeData = async (data) => {
    //window.console.log(data);
                try {
                    //await AsyncStorage.setItem('@username',this.state.username);
                    for (let i=0; i<data.length; i++) {
                        const NewData = {
                            username    : this.state.username,
                            userid : data[i].pid
                         };
                         await AsyncStorage.setItem('@data',JSON.stringify(NewData));
                      }
                     
                  } catch (error) {
                    // Error saving data
                }
        };
    doLogin = ()=>
    {
       
        GetPersonByLogin(this.state.username,this.state.userpass).then((regis) => {
            this.setState({ regis });
            //window.console.log(regis);
            if (regis.length <= 0)
            {
                alert('Please Try Again !!!');
                return false;
            }
            else
            {
                this._storeData(regis);
                Actions.Mainpage();
            }
          }).catch((error) => {
            alert(error);
          });

        
    }

    render(){
        return(
            <StyleProvider style={getTheme(commonColor)}>
            <Container style={{padding:20}}>
                <Content padder>
                <View style = {styles.box}>
                    <Text style = {styles.text_h1} >Login</Text>
                    <Text style = {styles.text_muted}>Sign in to your acount</Text>
                </View>
                <Form >
                        <Item regular style = {styles.text_input}>
                            <Icon active name='person' style = {styles.text_muted}/>
                            <Input placeholder='User Name' value={this.state.username} onChangeText={username => this.setState({username})} />
                         </Item>
                         <Item regular style = {styles.text_input}>
                            <Icon active name='key' style = {styles.text_muted}/>
                            <Input placeholder='Password' secureTextEntry value={this.state.userpass} onChangeText={userpass => this.setState({userpass})}/>
                         </Item>
                         <Button block primary onPress={() => {this.doLogin();}}>
                            <Text >Login</Text>
                        </Button>
                        
                </Form>
                </Content>
            </Container>

            </StyleProvider>

        )
        }
}

