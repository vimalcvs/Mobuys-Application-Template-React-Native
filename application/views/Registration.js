import React, { Component } from 'react';
import {Container, Content,Card,CardItem,Body,Icon, StyleProvider,Button,Left,Right,Item,Input,Form} from 'native-base';
import getTheme from '../../native-base-theme/components';
import commonColor from '../../native-base-theme/variables/commonColor';
import HeaderPage from './HeaderPage';
import {insertNewMobApp,GetDataRegs,deleteAllMobApp,insertNewPerson,deletePerson, GetPersonByPid,deletePersonByPid} from '../models/allSchemas';
import {Alert, Text,PermissionsAndroid} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Actions } from 'react-native-router-flux';
const message_disabled='ACTIVATE APP';
const message_enabled='REGISTERED';
//import DeviceInfo from 'react-native-device-info';
//import IMEI from 'react-native-imei';

export async function request_READ_PHONE_STATE() {
 
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE ,
      {
        'title': 'ReactNativeCode wants to READ_PHONE_STATE',
        'message': 'ReactNativeCode App needs access to your personal data. '
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
 
     // Alert.alert("Permission Granted.");
    }
    else {
 
      Alert.alert("Permission Not Granted");
 
    }
  } catch (err) {
    console.warn(err)
  }
}
export default class Registration extends Component {
    constructor(props) {
        super(props);
         this.state = {
            isLoading:false,
            secretid:'1',
            secretkey:'1',
            secretkey_system:'',
            isaktiv:false,
            configsLists:[],
            textReg:'',
            DeviceIMEI: '',
            configsRegs:[],
            okmang:'',
            username:'superadmin',
            userpass:''
        }
      
    }
   
   getDeviceIMEI = () => {
      const IMEI = require('react-native-imei');
      IMEI.getImei().then(imeiList => {
        this.setState({secretid: imeiList[0]})
        this.setState({configsLists: imeiList})
        });
     /* 
     const uniqueId = DeviceInfo.getUniqueID();
     this.setState({secretid: uniqueId})
     */
    }
    async componentDidMount() {
 
      await request_READ_PHONE_STATE() ;
      this._reloadData()
      this.getDeviceIMEI();

    }
   
    _reloadData = () => {
        GetDataRegs().then((configsRegs) => {
          this.setState({ configsRegs });
          var ddata=configsRegs;
          for (let i=0; i<ddata.length; i++) {
            this.setState({secretkey:ddata[i].masecretkey,
              okmang:ddata[i].notes
             }) 
           }
        }).catch((error) => {
            this.setState({ configsRegs: [] });
        });

        GetPersonByPid(1).then((dperson) => {
          this.setState({ dperson });
          var ddata=dperson;
          for (let i=0; i<ddata.length; i++) {
            this.setState({username:ddata[i].puser_name,
              userpass:ddata[i].plogin_pass
             }) 
           }
        }).catch((error) => {
            this.setState({ configsRegs: [] });
        });

     }
    ActDelete =() =>{
      deleteAllMobApp().then().catch((error) => {
        alert(`Save Data :  error ${error}`);
        });
        deletePerson().then().catch((error) => {
          alert(`Save Data :  error ${error}`);
          });
        

     }

  ActSave () {
    var aesjs = require('aes-js');
    // An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
    var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];

    // Convert text to bytes
    var text = this.state.secretid+'R21518';
    var textBytes = aesjs.utils.utf8.toBytes(text);

    // The counter is optional, and if omitted will begin at 1
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var encryptedBytes = aesCtr.encrypt(textBytes);

    // To print or store the binary data, you may convert it to hex
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

      /*  if (this.state.secretkey!==encryptedHex)
        {
            alert("Invalid Secret Key !!!");
            return false;
        }
*/
        Alert.alert("Save ","Activate Application ?", 
        [
          {text: 'Cancel', onPress: () => {}, style: 'cancel' },
          {text: 'Save', onPress: () => {
            var NewItems=[];
			          NewItems = {
                        maid         : Math.floor(Date.now() / 10),
                        masecretid     : this.state.secretid,
                        masecretkey    : this.state.secretkey,
                        notes        : 'OKMANG'
                    }
                   
                deleteAllMobApp().then().catch((error) => {
                    alert(`Save Data :  error ${error}`);
                    });
                insertNewMobApp(NewItems).then(
                  Alert.alert(
                    'Success',
                    'Save data successfully',
                    [
                      {
                        text: 'Ok',
                        onPress: () => {Actions.Home();}
                      },

                    ],
                    { cancelable: false }
                  )
                  
                ).catch((error) => {
                    alert(`Save Data :  error ${error}`);
                    });
              
                    var NewItems=[];
                    NewItems = {
                            pid         : 1,
                            pname       : this.state.username,
                            puser_name  : this.state.username,
                            plogin_pass : this.state.userpass,
                        }
                       
                    deletePersonByPid(1).then().catch((error) => {});
                    insertNewPerson(NewItems).then().catch((error) => {
                        alert(`Save Data :  error ${error}`);
                        });
                   
        	}}
		]);
  }  
  
  _the_encrypted_key = () =>
  {
     /*   var aesjs = require('aes-js');
        var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
        // The initialization vector (must be 16 bytes)
        var iv = [ 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,35, 36 ];
        // Convert text to bytes (text must be a multiple of 16 bytes)
        var text = this.state.secretid+'r21518';
        console.log(text);
        var textBytes = aesjs.utils.utf8.toBytes(text);
        var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
        var encryptedBytes = aesCbc.encrypt(textBytes);
        // To print or store the binary data, you may convert it to hex
        var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
      // console.log(encryptedHex);
*/
var aesjs = require('aes-js');
      // An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];

// Convert text to bytes
var text = this.state.secretid+'R21518';
var textBytes = aesjs.utils.utf8.toBytes(text);

// The counter is optional, and if omitted will begin at 1
var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
var encryptedBytes = aesCtr.encrypt(textBytes);

// To print or store the binary data, you may convert it to hex
var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
//console.log(encryptedHex);
// "a338eda3874ed884b6199150d36f49988c90f5c47fe7792b0cf8c7f77eeffd87
//  ea145b73e82aefcf2076f881c88879e4e25b1d7b24ba2788"

// When ready to decrypt the hex string, convert it back to bytes
//var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

// The counter mode of operation maintains internal state, so to
// decrypt a new instance must be instantiated.
//var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
//var decryptedBytes = aesCtr.decrypt(encryptedBytes);

// Convert our bytes back into text
//var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
//console.log(decryptedText);

        this.setState({
         // secretkey : encryptedHex,
          secretkey_system : encryptedHex,
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
                <Icon name='v-card' type="Entypo" style={{color:(this.state.okmang==='OKMANG') ? '#462749':'#ff0000',fontSize:30}}/> 
                <Body>
                  <Text style={{color:(this.state.okmang==="OKMANG") ? '#462749':'#ff0000'}} >{(this.state.okmang==="OKMANG")?message_enabled:message_disabled}</Text>
                  <Text note style={{fontSize:9,fontStyle:"italic",color:'#800080'}}>Registration Mobile Application</Text>
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
                            <Col style={{width:'20%'}}><Text style={{color:'#462749'}}>Secret ID</Text></Col>
                            <Col style={{width:'5%',textAlign:"right"}}><Text>:</Text></Col>
                            <Col>  
                                <Item regular style={{height:40}}>
                                    <Input editable = {false} value={this.state.secretid} onChangeText={ secretid => this.setState({secretid})}/>
                                 </Item>
                            </Col>
                        </Row>
                        <Row style={{marginBottom:5}}>
                            <Col style={{width:'20%'}}><Text style={{color:'#462749'}}>Secret Key</Text></Col>
                            <Col style={{width:'5%',textAlign:"right"}}><Text>:</Text></Col>
                            <Col>  
                                <Item regular style={{height:40}}>
                                    <Input value={this.state.secretkey} onChangeText={secretkey => this.setState({secretkey})}/>
                                </Item>
                            </Col>
                        </Row>

                        <Row style={{marginBottom:5}}>
                            <Col style={{width:'20%'}}><Text style={{color:'#462749'}}>Super User</Text></Col>
                            <Col style={{width:'5%',textAlign:"right"}}><Text>:</Text></Col>
                            <Col>  
                                <Item regular style={{height:40}}>
                                    <Input editable = {false} value={this.state.username} onChangeText={username => this.setState({username})}/>
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
              <Text  style={{ color:'#ffffff' }}>ACTIVATE APPLICATION</Text>
            </Button>
           
            
         </Content>
         
        
      </Container>
      </StyleProvider>
    );
  }
}
/* <Button style={{marginTop:10}} block primary onPress={() => this.ActDelete()}>
              <Text  style={{ color:'#ffffff' }}>DELETE</Text>
            </Button>
            <Card style={{marginTop:15}}>
            <CardItem>
              <Left>
                <Body>
                  <Text style={{color:'#462749'}}>Send Your SECRET ID to : +62 81809383548</Text>
                  <Text note style={{fontSize:9,fontStyle:"italic",color:'#800080'}}>Thank You</Text>
                </Body>
              </Left>
            </CardItem>
          </Card> */
