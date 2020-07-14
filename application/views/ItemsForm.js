import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Container, Content, Form, Item, Input, Icon,Button,Text,Left,Right,ListItem } from 'native-base';
import getStyles from '../../assets/styles';
import HeaderPage from './HeaderPage';
import {Actions} from 'react-native-router-flux';
import {insertNewItems} from '../models/allSchemas';

const styles = getStyles();

export default class ItemsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
          iid  : '',   
          t_icode: '',
          t_iname: '',
          t_price : 0,
          t_hna :0,
          price: 0,
        };
      //  realm = new Realm({ path: 'MObuysDB.realm' });
        
    } 
   
    ClearData=() =>{
      this.setState({iid :'',t_icode: '',t_iname: '',t_price: '0',t_hna: '0'})
   }
    itemsAdd = () => {
        var that = this;
        //const { iid } = this.state;
        const { t_icode } = this.state;
        const { t_iname } = this.state;
        const { t_price } = this.state;
        const { t_hna } = this.state;
        if (t_icode) {
          if (t_iname) {
           
            Alert.alert(
              'Save',
              'Save New Data ?',
              [
                {
                  text: 'No',
                  onPress: () => { }
                } ,   
                {
                  text: 'Yes',
                  onPress: () => {
                            const NewItems = {
                              iid : Math.floor(Date.now() / 10000),
                              icode : t_icode,
                              iname : t_iname,
                              create_time: new Date(),
                              modify_time: new Date(),
                              price : parseFloat(t_price),
                              harga_beli:parseFloat(t_hna),
                          };
                          insertNewItems(NewItems).then().catch((error) => {
                              alert(`Insert new Items :  error ${error}`);
                              });
                              Alert.alert(
                                'Success',
                                'You are input successfully',
                                [
                                  {
                                    text: 'Ok',
                                    onPress: () => {Actions.ItemsList();},
                                  },

                                ],
                                { cancelable: false }
                              );
                  },
                },
                           
              ],
              { cancelable: true }
            );

          } else {
            alert('Please fill Item Name');
          }
        } else {
          alert('Please fill Item Code');
        }
      };
    
    onChanged (text) {
        this.setState({ t_price: text.replace(/[^0-9]/g, '')});
      }

      onChangedhna (text) {
        this.setState({ t_hna: text.replace(/[^0-9]/g, '')});
      }
    
  render(){
    return(
      <Container>
       <HeaderPage/>
       
        <Content padder style={{ backgroundColor: "#f6f6f6" }}>
       
                    <ListItem style={{ backgroundColor: "#f6f6f6" }}>
                        <Left >
                            <Text style = {styles.text_h2}>  Add Item Data</Text>
                        </Left>
                        
                        <Right>
                            <Button small transparent onPress={() => Actions.ItemsList()} >
                                <Icon name='list' type='FontAwesome' />
                            </Button>
                        </Right>
                    </ListItem>
                <Form >
                        <Item regular style = {styles.text_input}>
                            <Icon active name='barcode' type='FontAwesome' style = {styles.text_muted}/>
                            <Input placeholder='Item Code' onChangeText={t_icode => this.setState({ t_icode })} value={this.state.t_icode} />
                         </Item>
                         <Item regular style = {styles.text_input}>
                            <Icon active name='book' type='FontAwesome' style = {styles.text_muted}/>
                            <Input placeholder='Item Name' onChangeText={t_iname => this.setState({ t_iname })} value={this.state.t_iname}/>
                         </Item>

                         <Item regular style = {styles.text_input}>
                            <Icon active name='money' type='FontAwesome' style = {styles.text_muted}/>
                            <Input keyboardType='numeric' maxLength={10} placeholder='Purchase Price' 
                             value={this.state.t_hna.toString()}
                            onChangeText = {(e)=> this.onChangedhna(e)}/>
                         </Item>


                         <Item regular style = {styles.text_input}>
                            <Icon active name='money' type='FontAwesome' style = {styles.text_muted}/>
                            <Input keyboardType='numeric' maxLength={10} placeholder='Item Price' 
                             value={this.state.t_price.toString()}
                            onChangeText = {(e)=> this.onChanged(e)}/>
                         </Item>

                          <Button style={{marginTop:10}} block primary onPress={this.itemsAdd.bind(this)}>
                                <Text >Save </Text>
                          </Button>
                </Form>


        </Content>
      
      </Container>
    );
  }
}