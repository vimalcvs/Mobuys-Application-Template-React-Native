import React, { Component } from 'react';
import {Container, Content,Card,CardItem,Body,Icon, StyleProvider,Button,Left,Right,Item,Input,Form} from 'native-base';
import getTheme from '../../native-base-theme/components';
import commonColor from '../../native-base-theme/variables/commonColor';
import HeaderPage from './HeaderPage';
import {DeletePayment,insertHisDel,GetPersonByLogin,deleteAllConfigs} from '../models/allSchemas';
import {Alert, Text} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Actions } from 'react-native-router-flux';
import moment from 'moment';

export default class TransaksiPaymentDelete extends Component {
    constructor(props) {
        super(props);
         this.state = {
            isLoading:false,
            user:'',
            pass:'',
            notes:'',
            noinv:'',
            configsLists:[],
        }
      
    }
  
  ActSave () {

    GetPersonByLogin(this.state.user,this.state.pass).then((regis) => {
      this.setState({ regis });
      //window.console.log(regis.length);
      if (regis.length < 1)
      {
        alert('Please Try Again !!!');
        return false;
      }

      //window.console.log(regis[0].pid);
      if (regis[0].pid > 1)
      {
          alert('Please Try Again !!!');
          return false;
      }
      else if (this.state.notes ==='') {
        alert('Please fill with data first - Notes !!!');
        return false;
      } 
      else
      {
        Alert.alert("Confirm ","Delete Payment ?", 
                [
              {text: 'Cancel', onPress: () => {}, style: 'cancel' },
              {text: 'Delete', onPress: () => {
                        var NewItems=[];
                          NewItems = {
                                user    : this.state.user,
                                pass    : this.state.pass,
                                gtid    : this.props.gtid,
                            }
                           
                            var ItemHis=[];
                            ItemHis = {
                                  trans_date  : moment(new Date()).format('YYYY-MM-DD'),
                                  user_del    : this.state.user,
                                  notes_del   : this.state.notes,
                                  gtid        : this.props.gtid,
                                  duid        : Math.floor(Date.now() / 10000),
                              }    
                        insertHisDel(ItemHis).then().catch((error) => {alert('err: '+error)});
                        DeletePayment(NewItems).then().catch((error) => {
                            alert(`Save Data :  error ${error}`);
                            });
                            Alert.alert(
                              'Success',
                              'Delete data successfully',
                              [
                                {
                                  text: 'Ok',
                                  onPress: () => {Actions.TransaksiList()},
                                },

                              ],
                              { cancelable: false }
                            );
                  }}
            ]);
      }
    }).catch((error) => {
      alert(error);
    });



      
  }  
 
  render(){
    return(
      <StyleProvider style={getTheme(commonColor)}>
      <Container>
      <HeaderPage/>
        <Content padder>
        <Card>
            <CardItem>
              <Left>
                <Icon name='help-circle' type="Feather" style={{color:'#462749',fontSize:30}}/> 
                <Body>
                  <Text style={{color:'#462749'}} >Delete Payment</Text>
                  <Text note style={{fontSize:9,fontStyle:"italic",color:'#800080'}}>Mobile Application</Text>
                </Body>
              </Left>
              <Right>
                  
              </Right>
            </CardItem>
          
          </Card>
          <Form >
          <Card style={{flex: 1}}>
          <CardItem>
              <Left>
             
                    <Grid >
                        <Row style={{marginBottom:5}}>
                            <Col style={{width:'20%'}}><Text style={{color:'#462749'}}>User</Text></Col>
                            <Col style={{width:'5%',textAlign:"right"}}><Text>:</Text></Col>
                            <Col>  
                                <Item regular style={{height:40}}>
                                    <Input value={this.state.user} onChangeText={ user => this.setState({user})}/>
                                 </Item>
                            </Col>
                        </Row>
                        <Row style={{marginBottom:5}}>
                            <Col style={{width:'20%'}}><Text style={{color:'#462749'}}>Pass</Text></Col>
                            <Col style={{width:'5%',textAlign:"right"}}><Text>:</Text></Col>
                            <Col>  
                                <Item regular style={{height:40}}>
                                    <Input secureTextEntry value={this.state.pass} onChangeText={(pass) => this.setState({pass})}/>
                                </Item>
                            </Col>
                        </Row>
                       
                        <Row style={{marginBottom:5}}>
                            <Col style={{width:'20%'}}><Text style={{color:'#462749'}}>Notes</Text></Col>
                            <Col style={{width:'5%',textAlign:"right"}}><Text>:</Text></Col>
                            <Col>  
                                <Item regular style={{height:40}}>
                                    <Input value={this.state.notes} onChangeText={(notes) => this.setState({notes})}/>
                                </Item>
                            </Col>
                        </Row>

                    </Grid>
                  
              </Left>
            </CardItem>
           
          </Card>
          </Form>
          <Button block primary onPress={() => this.ActSave()}>
              <Text  style={{ color:'#ffffff' }}>Delete Payment</Text>
          </Button>

          
           
         </Content>
         
      </Container>
      </StyleProvider>
    );
  }
}
