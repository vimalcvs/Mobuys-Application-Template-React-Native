import React, { Component } from 'react';
import {Container, Content,Card,CardItem,Body,Icon, StyleProvider,Button,Left,Right,Item,Input,Form} from 'native-base';
import getTheme from '../../native-base-theme/components';
import commonColor from '../../native-base-theme/variables/commonColor';
import HeaderPage from './HeaderPage';
import realm, { deletePersonByPid } from '../models/allSchemas';
import {insertNewPerson,GetPersonByPid} from '../models/allSchemas';
import {Alert, Text} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Actions } from 'react-native-router-flux';

export default class UserAccess extends Component {
    constructor(props) {
        super(props);
         this.state = {
            isLoading:false,
            isaktiv:false,
            configsLists:[],
            username:'',
            userpass:''
        }
      
    }
   
    componentDidMount() {
      this._reloadData();
       
    }

    _reloadData = () => {
      GetPersonByPid(2).then((configsRegs) => {
          this.setState({ configsRegs });
          var ddata=configsRegs;
          for (let i=0; i<ddata.length; i++) {
            this.setState({username:ddata[i].puser_name,
              userpass:ddata[i].plogin_pass
             }) 
           }
        }).catch((error) => {
            this.setState({ configsRegs: [] });
        });

     }
  
  ActSave () {

        if (this.state.username==='superadmin')
        {
          alert('Please ... Another Username !!!');
          return false;
        }

        Alert.alert("Save ","User Access Application ?", 
        [
          {text: 'Cancel', onPress: () => {}, style: 'cancel' },
          {text: 'Save', onPress: () => {
                var NewItems=[];
                    NewItems = {
                            pid         : 2,
                            pname       : this.state.username,
                            puser_name  : this.state.username,
                            plogin_pass : this.state.userpass,
                        }
                    deletePersonByPid(NewItems.pid).then().catch((error) => {});    
                    insertNewPerson(NewItems).then(alert('Insert Data Success')).catch((error) => {
                        alert(`Save Data :  error ${error}`);
                        return false;
                        });

                    Actions.Home();
        	}}
		]);
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
                <Icon name='v-card' type="Entypo" style={{color:'#462749',fontSize:30}}/> 
                <Body>
                  <Text style={{color:'#462749'}} >User Access</Text>
                  <Text note style={{fontSize:9,fontStyle:"italic",color:'#800080'}}>User Mobile Application</Text>
                </Body>
              </Left>
              <Right>
                  <Icon name="flower" type="Entypo" style={{color:'#ff0000',fontSize:25}}/> 
              </Right>
            </CardItem>
          
          </Card>
          <Form >
          <Card style={{flex: 1}}>
          <CardItem>
              <Left>
             
                    <Grid >
                        <Row style={{marginBottom:5}}>
                            <Col style={{width:'20%'}}><Text style={{color:'#462749'}}>User Name</Text></Col>
                            <Col style={{width:'5%',textAlign:"right"}}><Text>:</Text></Col>
                            <Col>  
                                <Item regular style={{height:40}}>
                                    <Input value={this.state.username} onChangeText={username => this.setState({username})}/>
                                </Item>
                            </Col>
                        </Row>
                        <Row style={{marginBottom:5}}>
                            <Col style={{width:'20%'}}><Text style={{color:'#462749'}}>Pass</Text></Col>
                            <Col style={{width:'5%',textAlign:"right"}}><Text>:</Text></Col>
                            <Col>  
                                <Item regular style={{height:40}}>
                                    <Input secureTextEntry value={this.state.userpass} onChangeText={userpass => this.setState({userpass})}/>
                                </Item>
                            </Col>
                        </Row>
                        
                    </Grid>
                  
              </Left>
            </CardItem>
           
          </Card>
          </Form>
            <Button block primary onPress={() => this.ActSave()}>
              <Text  style={{ color:'#ffffff' }}>Save</Text>
            </Button>
           
            
         </Content>
         
        
      </Container>
      </StyleProvider>
    );
  }
}
