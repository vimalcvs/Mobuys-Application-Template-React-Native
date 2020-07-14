import React, { Component } from 'react';
import {Container, Content,Card,CardItem,Body,Icon, Right,ListItem,Button,Left,Badge} from 'native-base';
import HeaderPage from './HeaderPage';
import {Platform, StyleSheet, Text} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Actions } from 'react-native-router-flux';

export default class RegAlert extends Component {
  render(){
    return(
      <Container>
       <HeaderPage/>
        <Content padder>
          <Card style={{flex: 1}}>
          <CardItem>
              <Left>
                <Body>
                  
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody style={{marginTop:25}}>
                <Grid style={{marginLeft:5,marginRight:5}} >
                <Row>
                    <Col style={styles.dashb4w} onPress={() => Actions.Registration()}>
                      <Icon name='umbrella' type="FontAwesome" style={{color:'#462749',fontSize:35}} /> 
                      <Text style={{color:'#462749',marginBottom:10,marginTop:10,fontWeight:"bold"}}>Click To Activate Application</Text>
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