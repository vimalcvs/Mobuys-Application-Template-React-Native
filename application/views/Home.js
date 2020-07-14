import React, { Component } from 'react';
import {Container, Content,Card,CardItem,Body,Icon, Right,ListItem,Button,Left,Badge} from 'native-base';
import HeaderPage from './HeaderPage';
import {AsyncStorage, StyleSheet, Text} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Actions } from 'react-native-router-flux';

export default class Home extends Component {
  constructor(props) {
    super(props);
     this.state = {
        username:'',
        userid:'',
    }
   
}
componentDidMount = () =>{ this.getData();}

  getData = async () => {
    try {
      const dlog = await AsyncStorage.getItem('@data');
          JSON.parse(dlog, (key, value) => {
            if (key==='username') this.setState({username:value});
            if (key==='userid') this.setState({userid:value});
          });
   } catch(e) {
      // error reading value
    }
  }

  get_menu =(mn) => {
    if(this.state.userid===2)
            {
                alert('Access Denied');
                return false;
            }
    else
    {
      if (mn===1) {Actions.Registration();}
      if (mn===2) {Actions.Profile()}
      if (mn===3) {Actions.ImportData();}

    }
  }
  render(){
    return(
      <Container>
       <HeaderPage/>
        <Content padder>
        <Card>
            <CardItem>
              <Left>
                <Icon name='user-circle' type="FontAwesome" style={{color:'#462749',fontSize:36}}/> 
                <Body>
                  <Text style={{color:'#462749'}} >Welcome {this.state.username}</Text>
                  <Text note style={{fontSize:9,fontStyle:"italic",color:'#800080'}}>Cashier Mobile Application</Text>
                </Body>
              </Left>
              <Right>
                  <Icon name="flower" type="Entypo" style={{color:'#ff0000',fontSize:25}}/> 
              </Right>
            </CardItem>
          
          </Card>

          <Grid >
                <Col style={styles.dashb1} onPress={() => Actions.TransaksiAdd()}>
                  <Icon name='shopping-cart' type="FontAwesome" style={styles.icondash}  /> 
                  <Text style={styles.textdash}>CASHIER</Text>
                </Col>
                <Col style={styles.dashb2} onPress={() => Actions.TransaksiList()}>
                <Icon name='documents' type="Entypo"  style={styles.icondash}  /> 
                  <Text style={styles.textdash}>REPORT</Text>
                </Col>
                <Col style={styles.dashb3} onPress={() => Actions.ItemsList()}>
                <Icon name='product-hunt' type="FontAwesome"  style={styles.icondash}/> 
                  <Text style={styles.textdash}>ITEMS</Text>
                </Col>
            </Grid>

          <Card style={{flex: 1}}>
          <CardItem>
              <Left>
                <Body>
                  
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
                <Grid style={{marginLeft:5,marginRight:5}} >
                <Row>
                    <Col style={styles.dashb4w} onPress={() => this.get_menu(1)}>
                      <Icon name='umbrella' type="FontAwesome" style={{color:'#f66',fontSize:30}} /> 
                      <Text style={{color:'#f66',marginBottom:10,marginTop:10,fontWeight:"bold",fontSize:12}}>Registration</Text>
                    </Col>
                                       
                   
                    <Col style={styles.dashb4w} onPress={() => Actions.UserAccess()}>
                      <Icon name='users' type="Entypo" style={{color:'#4caf50',fontSize:27}} /> 
                      <Text style={{color:'#4caf50',marginBottom:10,marginTop:10,fontWeight:"bold",fontSize:12}}>User</Text>
                    </Col>

                    <Col style={styles.dashb4w} onPress={() => this.get_menu(2)}>
                      <Icon name='gear' type="FontAwesome" style={{color:'#ff0000',fontSize:30}} /> 
                      <Text style={{color:'#ff0000',marginBottom:10,marginTop:10,fontWeight:"bold",fontSize:12}}>Profile</Text>
                    </Col>
                    <Col style={styles.dashb4w} onPress={() => this.get_menu(3)}>
                      <Icon name='upload' type="Entypo" style={{color:'#ff9800',fontSize:27}} /> 
                      <Text style={{color:'#ff9800',marginBottom:10,marginTop:10,fontWeight:"bold",alignItems:"center",fontSize:12}}>Import</Text>
                    </Col>
                  </Row>

                  <Row style={{marginTop:10}}>
                    <Col style={styles.dashb4w} onPress={() => Actions.TransaksiRekap()}>
                      <Icon name='export' type="Entypo" style={{color:'#20B2AA',fontSize:33}} /> 
                        <Text style={{color:'#20B2AA',marginBottom:10,marginTop:10,fontWeight:"bold"}}>Report Rekap</Text>
                      </Col>
                      <Col style={styles.dashb4w} onPress={() => Actions.Sett_Print()}>
                        <Icon name='print' type="FontAwesome" style={{color:'#800080',fontSize:36}} /> 
                        <Text style={{color:'#800080',marginBottom:10,marginTop:10,fontWeight:"bold"}}>Printer Setting</Text>
                      </Col>
                      <Col style={styles.dashb4w} onPress={() => Actions.History_delete()}>
                        <Icon name='history' type="FontAwesome" style={{color:'#462749',fontSize:36}} /> 
                        <Text style={{color:'#462749',marginBottom:10,marginTop:10,fontWeight:"bold"}}>Del Payment</Text>
                      </Col>
                    
                  </Row>
                </Grid>
            </CardItem>
          </Card>

         </Content>
         
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop:240,
  },
  icondash:{
     fontSize:52,
     color:'#fff',
     marginTop:10,
     marginBottom:10
  },
  textdash:
  {
    fontSize:12,
    fontWeight: "bold",
    color:'#fff',
    marginBottom:10,
    }
  ,
 dashb1:{
   flex:1,
   padding:10,
   justifyContent: 'center',
   alignItems: 'center',
   margin: 3,
   backgroundColor: '#4caf50',
   borderRadius: 5,
  //borderWidth: 1,
  //borderColor: '#ff9800',
  //textAlign:'center',
  
 },
 dashb2:{
  flex:1,
  padding:10,
  justifyContent: 'center',
  alignItems: 'center',
  margin: 3,
  backgroundColor: '#ff9800',
  borderRadius: 5,
},
 dashb3:{
  flex:1,
  padding:10,
  justifyContent: 'center',
  alignItems: 'center',
  margin: 3,
  backgroundColor: '#f44336',
  borderRadius: 5,
},
dashb4:{
  borderRadius: 4,
  justifyContent: 'center',
  alignItems: 'center',
  margin: 3,
  backgroundColor: '#9c27b0',
  
},
dashb4w:{
  borderRadius: 4,
  justifyContent: 'center',
  alignItems: 'center',
  margin: 3,
  backgroundColor: '#fff',
  
},
icondash4:{
  fontSize:25,
  color:'#fff',
  marginTop:10,
  marginBottom:10
}, 
textdash4:
{
  fontSize:10,
  fontWeight: "bold",
  color:'#fff',
  marginBottom:10,
  }
,
welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  
});