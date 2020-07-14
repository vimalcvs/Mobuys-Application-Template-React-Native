import React, { Component } from 'react';
import {Container, Content,Card,CardItem,Body,Icon, StyleProvider,Button,Left,Right,Item,Input,Form} from 'native-base';
import getTheme from '../../native-base-theme/components';
import commonColor from '../../native-base-theme/variables/commonColor';
import HeaderPage from './HeaderPage';
import realm from '../models/allSchemas';
import {insertNewConfigs,queryConfigs,deleteAllConfigs} from '../models/allSchemas';
import {Alert, Text} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Actions } from 'react-native-router-flux';

export default class Profile extends Component {
    constructor(props) {
        super(props);
         this.state = {
            isLoading:false,
            namatoko:'',
            alamattoko:'',
            nomortlp:'',
            promo:'',
            noinv:'',
            configsLists:[],
        }
      
    }
    
    componentDidMount = () =>{
        this.setState({isLoading:true},this._getDB());
       
    }
    _getDB=() =>{
        this._reloadData();
        realm.addListener('change', () => {this._reloadData()}); 
        }

    _reloadData = () => {
        queryConfigs().then((configsLists) => {
          this.setState({ configsLists });
          var ddata=configsLists;
          for (let i=0; i<ddata.length; i++) {
            // window.console.log(ddata[i].cname);
             if (ddata[i].cname==='namatoko') this.setState({namatoko:ddata[i].cdata}) 
             if (ddata[i].cname==='alamattoko') this.setState({alamattoko:ddata[i].cdata}) 
             if (ddata[i].cname==='nomortlp') this.setState({nomortlp:ddata[i].cdata}) 
             if (ddata[i].cname==='promo') this.setState({promo:ddata[i].cdata}) 
             if (ddata[i].cname==='noinv') this.setState({noinv:ddata[i].cdata}) 
           }
        }).catch((error) => {
            this.setState({ configsLists: [] });
        });
     }
  ActSave () {
        Alert.alert("Save ","Save Data Profile ?", 
        [
			{text: 'Cancel', onPress: () => {}, style: 'cancel' },
			{text: 'Save', onPress: () => {
                var push_data=[]; var NewItems=[];
			            NewItems = {
                        cid         : Math.floor(Date.now() / 10),
                        cname       : "namatoko",
                        cdata       : this.state.namatoko,
                    }
                    push_data.push(NewItems);NewItems=[];
                    NewItems = {
                        cid         : Math.floor(Date.now() / 100),
                        cname       : "alamattoko",
                        cdata       : this.state.alamattoko,
                    }
                    push_data.push(NewItems);NewItems=[];
                    NewItems = {
                        cid         : Math.floor(Date.now() / 1000),
                        cname       : "nomortlp",
                        cdata       : this.state.nomortlp,
                    }
                    push_data.push(NewItems);
                    NewItems=[];
                    NewItems = {
                        cid         : Math.floor(Date.now() / 10000),
                        cname       : "promo",
                        cdata       : this.state.promo,
                    }
                   push_data.push(NewItems);
                   NewItems=[];
                    NewItems = {
                        cid         : Math.floor(Date.now() / 100000),
                        cname       : "noinv",
                        cdata       : this.state.noinv,
                    }
                   push_data.push(NewItems);
                   
                   deleteAllConfigs().then().catch((error) => {
                    alert(`Save Data :  error ${error}`);
                    });
                    insertNewConfigs(push_data).then().catch((error) => {
                    alert(`Save Data :  error ${error}`);
                    });
                    
                    Alert.alert(
                      'Success',
                      'Save data successfully',
                      [
                        {
                          text: 'Ok',
                          onPress: () => {Actions.Home()},
                        },

                      ],
                      { cancelable: false }
                    );
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
                  <Text style={{color:'#462749'}} >My Shop</Text>
                  <Text note style={{fontSize:9,fontStyle:"italic",color:'#800080'}}>Configuration Mobile Application</Text>
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
                            <Col style={{width:'20%'}}><Text style={{color:'#462749'}}>Name</Text></Col>
                            <Col style={{width:'5%',textAlign:"right"}}><Text>:</Text></Col>
                            <Col>  
                                <Item regular style={{height:40}}>
                                    <Input value={this.state.namatoko} onChangeText={ namatoko => this.setState({namatoko})}/>
                                 </Item>
                            </Col>
                        </Row>
                        <Row style={{marginBottom:5}}>
                            <Col style={{width:'20%'}}><Text style={{color:'#462749'}}>Address</Text></Col>
                            <Col style={{width:'5%',textAlign:"right"}}><Text>:</Text></Col>
                            <Col>  
                                <Item regular style={{height:40}}>
                                    <Input value={this.state.alamattoko} onChangeText={(i_alamattoko) => this.setState({alamattoko:i_alamattoko})}/>
                                </Item>
                            </Col>
                        </Row>
                        <Row style={{marginBottom:5}}>
                            <Col style={{width:'20%'}}><Text style={{color:'#462749'}}>TLP</Text></Col>
                            <Col style={{width:'5%',textAlign:"right"}}><Text>:</Text></Col>
                            <Col>  
                                <Item regular style={{height:40}}>
                                    <Input value={this.state.nomortlp} onChangeText={(nomortlp) => this.setState({nomortlp:nomortlp})}/>
                                </Item>
                            </Col>
                        </Row>
                        <Row style={{marginBottom:5}}>
                            <Col style={{width:'20%'}}><Text style={{color:'#462749'}}>Promo</Text></Col>
                            <Col style={{width:'5%',textAlign:"right"}}><Text>:</Text></Col>
                            <Col>  
                                <Item regular style={{height:40}}>
                                    <Input value={this.state.promo} onChangeText={(promo) => this.setState({promo:promo})}/>
                                </Item>
                            </Col>
                        </Row>
                        <Row style={{marginBottom:5}}>
                            <Col style={{width:'20%'}}><Text style={{color:'#462749'}}>Nomor Inv</Text></Col>
                            <Col style={{width:'5%',textAlign:"right"}}><Text>:</Text></Col>
                            <Col>  
                                <Item regular style={{height:40}}>
                                    <Input value={this.state.noinv} onChangeText={(noinv) => this.setState({noinv:noinv})}/>
                                </Item>
                            </Col>
                        </Row>
                    </Grid>
                  
              </Left>
            </CardItem>
           
          </Card>
          </Form>
          <Button block primary onPress={() => this.ActSave()}>
              <Text  style={{ color:'#ffffff' }}>SAVE PROFILE</Text>
          </Button>

          
           
         </Content>
         
      </Container>
      </StyleProvider>
    );
  }
}
