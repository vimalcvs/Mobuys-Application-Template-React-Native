import React, { Component } from 'react';
import {Container, Content,Card,CardItem,Body,Icon, Right,ListItem,Button,Left,Input,Item,StyleProvider} from 'native-base';
import getTheme from '../../native-base-theme/components';
import commonColor from '../../native-base-theme/variables/commonColor';
import {BackHandler, StyleSheet, Text,Alert,AsyncStorage} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Actions } from 'react-native-router-flux';
import NumberFormat from 'react-number-format';
import getStyles from '../../assets/styles';
import {insertNewPayment,queryConfigs} from '../models/allSchemas';
//import {BluetoothEscposPrinter} from "react-native-bluetooth-escpos-printer";
import moment from 'moment';

const styles = getStyles();

export default class TransaksiPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      u_cash:0,
      u_kembali:0,
      t_price:0,
      gtid :0,
      diskon:0,
      configsLists:[],
      username:'',
      userid:'',
  }
}
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
handleBackButtonClick = () => {
  this.props.navigation.goBack(null);
  return false;
};

componentWillUnmount() {
  BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
};
componentDidMount() {
  BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  queryConfigs().then((configsLists) => {
    this.setState({ configsLists });
  }).catch((error) => {
      this.setState({ configsLists: [] });
  });
  this.getData();
};

ActTransaksi = () => {
  var xx=(parseFloat(this.props.databill)-parseFloat(this.state.diskon));
  if (parseFloat(xx) < 0)
  {
      alert(' Diskon Lebih dari Total Pembelian !!!');
      return false;
  }

  if (parseFloat(xx) > 0 )
  {
    if (parseFloat(this.state.u_cash)===0)
    {   alert(' Pembayaran Kurang !!!');
        return false;
    }
  }

  if ((parseFloat(this.state.u_cash)-parseFloat(xx))<0)
  {
      alert(' Pembayaran Kurang !!!');
      return false;
  }
  Alert.alert(
        'Save',
        'Save Payment ?',
        [
          {
            text: 'No',
            onPress: () => { }
          } ,   
          {
            text: 'Yes',
            onPress: () => {
                  const NewPayment = {
                      gtid            : this.props.nomorinv,
                      amount_payment  : parseFloat(this.props.databill)-parseFloat(this.state.diskon),
                      amount_diskon   : parseFloat(this.state.diskon),
                      amount_cash     : parseFloat(this.state.u_cash),
                      amount_charge   : parseFloat(this.state.u_kembali),
                      notes           : '-',
                      user_pay        : this.state.username,
                  };
                  insertNewPayment(NewPayment).then(
                    Alert.alert(
                      'Success',
                      'Transaction Saved',
                      [
                        {
                          text: 'Ok',
                          onPress: (async () => {
                          try {
                            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
                          } catch (e) {
                            alert("Bluetooth Printer Not Connected !");
                              Actions.TransaksiAdd();
                              return false;
                          }
                          
                          var rows=this.props.dataitems;
                          var ddata=this.state.configsLists;
                          var tgltrans='';
                          // ambil tanggal transaksi
                          for(let i in rows){
                            let row = rows[i];
                            tgltrans=row.tgltrans;
                            break;
                          }
                          for (let i in ddata) {
                            let row = ddata[i];
                             if (row.cname==='namatoko') { await BluetoothEscposPrinter.printText( row.cdata + "\r\n", {});}
                             if (row.cname==='alamattoko') { await BluetoothEscposPrinter.printText( row.cdata + "\r\n", {});} 
                             if (row.cname==='nomortlp') { await BluetoothEscposPrinter.printText( row.cdata + "\r\n", {});}
                             if (row.cname==='noinv') {noi=row.cdata;}
                             if (row.cname==='promo') {promo=row.cdata;}
                           }
                        atnama=(this.props.atasnama ==='')?'':'  CN:'+this.props.atasnama;
                       
                        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
                        await BluetoothEscposPrinter.printText("--------------------------------\r\n", {});
                        await BluetoothEscposPrinter.printText(noi+this.props.nomorinv+" "+ moment(tgltrans).format('DD-MM-YYYY hh:mm:ss')  + "\r\n", { fonttype: 2});
                        await BluetoothEscposPrinter.printText("--------------------------------\r\n", {});
                        var toti=0;
                        for(let i in rows){
                          let row = rows[i];
                          await BluetoothEscposPrinter.printColumn([30],
                            [BluetoothEscposPrinter.ALIGN.LEFT],
                            [row.iname ],{});
                            await BluetoothEscposPrinter.printColumn([10,1,10,11],
                                [BluetoothEscposPrinter.ALIGN.RIGHT,BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.RIGHT,BluetoothEscposPrinter.ALIGN.RIGHT],
                                [row.vol.toString(),"x",row.amount_price.toString(),row.amount_subtotal.toString() ],{});
                          toti=parseFloat(toti)+parseFloat(row.vol);
                        }
                        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
                        await BluetoothEscposPrinter.printText("--------------------------------\r\n", {});
                        await BluetoothEscposPrinter.printColumn([19, 2, 11],
                          [BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.RIGHT],
                          ["TOTAL",":",this.props.databill.toString()],{});
                        await BluetoothEscposPrinter.printColumn([19, 2, 11],
                            [BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.RIGHT],
                            ["DISCOUNT",":",this.state.diskon.toString()],{});
                        await BluetoothEscposPrinter.printColumn([19, 2, 11],
                          [BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.RIGHT],
                          ["CASH",":",this.state.u_cash.toString()],{});
                       await BluetoothEscposPrinter.printColumn([19, 2, 11],
                        [BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.RIGHT],
                        ["CHANGE",":",this.state.u_kembali.toString()],{});
                      await BluetoothEscposPrinter.printText("--------------------------------\r\n", {});
                      await BluetoothEscposPrinter.printText("Total Items :"+toti.toString()+atnama+"\r\n", {});
                      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
                      await BluetoothEscposPrinter.printText(promo + "\r\n", {});
                      await BluetoothEscposPrinter.printText(" Printed At : "+ moment(new Date()).format('DD-MM-YYYY hh:mm:ss')  + "\r\n\r\n", { fonttype: 1});
                        Actions.TransaksiAdd();
                        })
                        },
                      ],
                      { cancelable: false }
                    )
                  ).catch((error) => {
                      alert(`Insert new Trans :  error ${error}`);
                  });
                 
            },
          },
        ],
        { cancelable: true }
      );

};
_onChanged (text) {
  var xx =text.replace(/[^0-9]/g, '0');
  if (xx=='') xx=0;
  var uang=parseFloat(xx);
  var totbayar=parseFloat(this.props.databill);
  this.setState({ u_cash: uang});
  var kemb=parseFloat(uang) - (parseFloat(totbayar)-parseFloat(this.state.diskon));
  if (parseFloat(kemb) < 0 ){ this.setState({u_kembali:0})}
  else {this.setState({u_kembali:kemb})}
}

_onChanged_diskon (text) {
  var xx =text.replace(/[^0-9]/g, '0');
  if (xx=='') xx=0;
  var diskon_rp=parseFloat(xx);
  var totbayar=parseFloat(this.props.databill);
  this.setState({ diskon: diskon_rp});
  var kemb=parseFloat(this.state.u_cash) - (parseFloat(totbayar) - parseFloat(diskon_rp));
  if (parseFloat(kemb) < 0 ){ this.setState({u_kembali:0})}
  else {this.setState({u_kembali:kemb})}
}
  render(){
    return(
      <StyleProvider style={getTheme(commonColor)}>
      <Container>
       
        <Content padder>
        <Card>
            <CardItem>
              <Left>
                <Icon name='infocirlce' type="AntDesign" style={{color:'#462749',fontSize:36}}/> 
                <Body>
                  <NumberFormat value={this.props.databill} displayType={'text'} thousandSeparator={true} renderText={value => <Text style={{color:'#462749',fontSize:32}}>{value}</Text>}/>
                  <Text note style={{fontSize:9,fontStyle:"italic",color:'#800080'}}>No.Inv: {this.props.nomorinv}</Text>
                </Body>
              </Left>
              <Right>
              <Button small iconRight transparent onPress={() => Actions.TransaksiAdd()} >
                  <Icon name="shopping-basket" type="FontAwesome" style={{ color:'#4caf50',fontSize:30}}/> 
                  </Button>
              </Right>
            </CardItem>
          
          </Card>
          <Card style={{flex: 1}}>
            <CardItem>
                <Left>
                  <Body>
                    
                  </Body>
                </Left>
              </CardItem>
              <CardItem cardBody>
             
                  <Grid style={{marginLeft:10,marginRight:5}} >
                  
                    <Row >
                          <Col style={{width:'35%'}}><Text style={{color:'#462749',fontSize:18}}>DISKON</Text></Col>
                          <Col style={{width:'10%',textAlign:"right"}}><Text style={{color:'#462749'}}>Rp</Text></Col>
                          <Col>  
                              <Item regular style = {styles.text_input}>
                                <Input style={{textAlign:"right"}}  keyboardType='numeric' maxLength={10} value={this.state.diskon.toString()} onChangeText={(diskon) => this._onChanged_diskon(diskon)}/>
                              </Item>
                          </Col>
                    </Row>
                    <Row >
                          <Col style={{width:'35%'}}><Text style={{color:'#462749',fontSize:18}}>C A S H</Text></Col>
                          <Col style={{width:'10%',textAlign:"right"}}><Text style={{color:'#462749'}}>Rp</Text></Col>
                          <Col>  
                              <Item regular style = {styles.text_input}>
                                <Input style={{textAlign:"right"}}  autoFocus = {true} keyboardType='numeric' maxLength={10} value={this.state.u_cash.toString()} onChangeText={(u_cash) => this._onChanged(u_cash)}/>
                              </Item>
                          </Col>
                    </Row>
                    <Row style={{ height :40}} >
                          <Col style={{width:'35%'}}><Text style={{color:'#462749',fontSize:18}}>CHANGE</Text></Col>
                          <Col style={{width:'10%',textAlign:"right"}}><Text style={{color:'#462749'}}>Rp</Text></Col>
                          <Col >  
                            <Text style={{textAlign:"right",color:'#800080',fontSize:20}}>{this.state.u_kembali}</Text>
                          </Col>
                    </Row>

                  </Grid>
                 
            </CardItem>
          </Card>
            <Button block primary onPress={() => this.ActTransaksi()}>
              <Text  style={{ color:'#ffffff' }}>PAYMENT</Text>
            </Button>
         </Content>
         
      </Container>
      </StyleProvider>
    );
  }
}
