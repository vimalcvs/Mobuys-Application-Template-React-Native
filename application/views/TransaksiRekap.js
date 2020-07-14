/*
*********
Created November 2018 By AK78 - yayasunarya@gmail.com
*********
===========================================
Big Thank to :

Mr Nguyen Duc Hoang
https://www.youtube.com/c/nguyenduchoang
Email: sunlight4d@gmail.com
TodoListComponent = "TodoList Screen"
===========================================
*/
import React, {Component} from 'react';
import { FlatList,Alert,View } from 'react-native';
import {Container, Content,List, ListItem, Left, Body, Right, Text,Item,Input,Icon,Button,Form,SwipeRow,Card,CardItem } from 'native-base';
import {Actions} from 'react-native-router-flux';
import getStyles from '../../assets/styles';
import {rekap_penjualan,queryAllTrans,deleteTrans,GetConfigName,DetailTransaksi,queryExportTrans,queryExportTransDetail,queryConfigs} from '../models/allSchemas';

import moment from 'moment';
import NumberFormat from 'react-number-format';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Col, Row, Grid } from "react-native-easy-grid";
//import {BluetoothEscposPrinter} from "react-native-bluetooth-escpos-printer";
/*==excel=*/
import XLSX from 'xlsx';
// react-native-fs
import { writeFile, readFile } from 'react-native-fs';
import RNFS from 'react-native-fs';
const DDP = RNFS.ExternalDirectoryPath +"/";
const output = str => str;
const styles = getStyles();

export default class TransaksiRekap extends React.Component {
    constructor(props) {
        super(props);
        this.array=[];
        this.state = {
                isLoading:false,
                modalVisible:false,
                TransLists: [],
                TransListsExcel:[],
                dt1 :moment(new Date()).format('DD-MM-YYYY'),
                dt2 :moment(new Date()).format('DD-MM-YYYY'),
                qdt1: new Date(),
                qdt2: new Date(),
                TransListsDetail:[],
                ItemsListsExcel:[],
                configsLists:[],
                total_amount:0,
                total_payment:0,
                total_diskon:0,
            };
           
        }
    
        componentDidMount = () =>{ this._reloadData();}
       
    
        _reloadData = () => {
           
            var valdata=[];
            var listdata={};

           rekap_penjualan(this.state.qdt1,this.state.qdt2).then((TransLists) => {
                var _ddata=TransLists;
                var ArrNew={}; var push_data=[]; 
                var i=1;
                _ddata.forEach(function(array2) {
                        ArrNew={
                        tgl:moment(array2.trans_date).format('DD-MM-YYYY'),
                        tglprint:moment(array2.trans_date).format('DD-MM-YY'),
                        amount:array2.amount,
                        payment:array2.amount_payment,
                        diskon:array2.amount_diskon
                    }
                        push_data.push(ArrNew);
                        ArrNew={};
                 });
               //  window.console.log(push_data);
                 this.array=[];var _total_amount=0;var _total_payment=0;var _total_diskon=0;
                 for (let i=0; i<push_data.length; i++) {
                    var result = this.array.find(function(element) {
                        return element.tgl === push_data[i].tgl;
                      });
                    //window.console.log('tanggal--'+push_data[i].tgl);
                   // window.console.log('xx'+result);
                    if(result)
                    {
                       for (let j=0; j < this.array.length; j++) {
                        if(this.array[j].tgl==result.tgl)
                            {
                                //window.console.log(this.array[j].tgl+'----------'+push_data[i].tgl);
                                this.array[j].amount +=parseFloat(push_data[i].amount);
                                this.array[j].payment +=parseFloat(push_data[i].payment);
                                this.array[j].diskon +=parseFloat(push_data[i].diskon);
                                j=this.array.length+1;
                            }
                        }
                    }
                    else
                    {
                        this.array.push({ 
                                tgl  : push_data[i].tgl,
                                amount  : push_data[i].amount,
                                payment  : push_data[i].payment,
                                diskon  : push_data[i].diskon,
                                tglprint: push_data[i].tglprint,
                            });
                    }
                    _total_amount +=parseFloat(push_data[i].amount);
                    _total_payment +=parseFloat(push_data[i].payment);
                    _total_diskon +=parseFloat(push_data[i].diskon);
                    
                  }
                 // console.log(this.array);
                 this.setState({
                    total_amount:_total_amount,
                    total_payment:_total_payment,
                    total_diskon:_total_diskon
                });
                this.setState({ TransLists:[...this.array] });
            }).catch((error) => {
                this.setState({ TransLists: [] });
            });
           
            window.console.log('reload rekap');
           
        }
       
        _RenderItems =({ item, index }) => (
           <Grid style={{marginLeft:10, height:35}} >
                        <Col style={{width:'25%',textAlign:'center'}} >
                            <Text >{item.tgl}</Text>
                        </Col>
                        <Col style={{width:'25%',textAlign:'center'}} >
                            <NumberFormat value={item.amount} displayType={'text'} thousandSeparator={true} renderText={value => <Text style={{textAlign: 'right'}}>{value}</Text>}/>
                        </Col>
                        <Col style={{width:'25%',textAlign:'center'}} >
                            <NumberFormat value={item.payment} displayType={'text'} thousandSeparator={true} renderText={value => <Text style={{textAlign: 'right'}}>{value}</Text>}/>
                        </Col>
                        <Col style={{width:'25%'}}>
                            <NumberFormat value={item.diskon} displayType={'text'} thousandSeparator={true} renderText={value => <Text style={{textAlign: 'right'}}>{value}</Text>}/>
                        </Col>
                    </Grid>
        );

      
 
        _ListEmpty = () => {
            return (
                <List style={{ backgroundColor: '#f6f6f6' }} 
                
                >
                    <ListItem >
                      <Body style={{ marginLeft:-10}}>
                          <Text style={{ color:'#474747'}}>No Data Found</Text>
                      </Body>
                      <Right><Text></Text></Right>
                    </ListItem>
                </List>
            );
          }
             
        _exportFile() {
            Alert.alert(
                'Export Data',
                'Export Data To Excell ?',
                [
                    {
                        text: 'No', onPress: () => { },//Do nothing
                        style: 'cancel'
                    },
                    {
                      text: 'Yes', onPress: () => {
                            var _ddata=this.state.TransLists;
                            var ArrNew=[];
                            var i=1;
                            var push_data=[]; 
                                ArrNew[0]='No';
                                ArrNew[1]='Trans Date';
                                ArrNew[2]='Amount';
                                ArrNew[3]='Payment';
                                ArrNew[4]='Discount';
                                push_data.push(ArrNew);
                                ArrNew=[];
                            _ddata.forEach(function(array2) {
                                ArrNew[0]=i;
                                ArrNew[1]=array2.tgl;
                                ArrNew[2]=array2.amount;
                                ArrNew[3]=array2.payment;
                                ArrNew[4]=array2.diskon;
                                i=i+1;
                                push_data.push(ArrNew);
                                ArrNew=[];
                            });
                            ArrNew[0]='';
                            ArrNew[1]='TOTAL';
                            ArrNew[2]=this.state.total_amount;
                            ArrNew[3]=this.state.total_payment;
                            ArrNew[4]=this.state.total_diskon;
                            push_data.push(ArrNew);
                            ArrNew=[];
                            const ws = XLSX.utils.aoa_to_sheet(push_data);
                            const wb = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
                            /* write file  */
                            const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});
                            const file = DDP + "RekapTransaksi.xlsx";
                            writeFile(file, output(wbout), 'ascii').then((res) =>{
                                    Alert.alert("exportFile success", "Exported to " + file);
                                    this.setState({ ItemsListsExcel: [] });
                            }).catch((err) => { Alert.alert("exportFile Error", "Error " + err.message); });
                      }
                    },
                ],
                { cancelable: true }
            );
            
    
        };  

        _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
        _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
        _handleDatePicked = (date) => {
          this.setState({ dt1:moment(date).format('DD-MM-YYYY') });
          this.setState({ qdt1:date});
          this._hideDateTimePicker();
        };
        _showDateTimePicker2 = () => this.setState({ isDateTimePickerVisible2: true });
        _hideDateTimePicker2 = () => this.setState({ isDateTimePickerVisible2: false });
        _handleDatePicked2 = (date) => {
          this.setState({ dt2:moment(date).format('DD-MM-YYYY') });
          this.setState({ qdt2:date});
          this._hideDateTimePicker2();
        };

        _printRekap =  async (Listdata)  => 
        {
            queryConfigs().then((configsLists) => {
                this.setState({ configsLists });
              }).catch((error) => {
                  this.setState({ configsLists: [] });
              });

         
            try { 
                await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
              } catch (e) {
                alert("Bluetooth Printer Not Connected !");
                return false;
              }
              
              
              var ddata=this.state.configsLists;
             
              for (let i in ddata) {
                let row = ddata[i];
                 if (row.cname==='namatoko') {  await BluetoothEscposPrinter.printText( row.cdata + "\r\n", {});}
                 if (row.cname==='alamattoko') { await  BluetoothEscposPrinter.printText( row.cdata + "\r\n", {});} 
                 if (row.cname==='nomortlp') { await  BluetoothEscposPrinter.printText( row.cdata + "\r\n", {});}
               }
               await BluetoothEscposPrinter.printText("--------------------------------\r\n", {});
               var rows=this.state.TransLists;
            await BluetoothEscposPrinter.printColumn([9,8,8,7],
                [BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.RIGHT],
                ["DATE","AMOUNT","PAYMENT","DISKON"],{});
                for(let i in rows){
                    let row = rows[i];
                    await BluetoothEscposPrinter.printColumn([9,8,8,7],
                          [BluetoothEscposPrinter.ALIGN.RIGHT,BluetoothEscposPrinter.ALIGN.RIGHT,BluetoothEscposPrinter.ALIGN.RIGHT,BluetoothEscposPrinter.ALIGN.RIGHT],
                          [row.tglprint,row.amount.toString(),row.payment.toString(),row.diskon.toString()],{});
                  }
            await BluetoothEscposPrinter.printText("--------------------------------\r\n", {});
            await BluetoothEscposPrinter.printColumn([8,8,8,8],
                [BluetoothEscposPrinter.ALIGN.RIGHT,BluetoothEscposPrinter.ALIGN.RIGHT,BluetoothEscposPrinter.ALIGN.RIGHT,BluetoothEscposPrinter.ALIGN.RIGHT],
                ["TOTAL",this.state.total_amount.toString(),this.state.total_payment.toString(),this.state.total_diskon.toString()],{});
            await BluetoothEscposPrinter.printText("--------------------------------\r\n", {});
            await BluetoothEscposPrinter.printText(" Printed At : "+ moment(new Date()).format('DD-MM-YYYY hh:mm:ss')  + "\r\n\r\n", { fonttype: 1});
             
        }

render() {
        return (
            <Container>
                
                <Content padder>
                <ListItem noIndent style={{ backgroundColor: "#f6f6f6", marginLeft:0}}>
                        <Left >
                            <Item regular style={{height:30, width:'30%',marginLeft:-10}}>
                                 <Input editable = {false}  style={{ fontSize:12}}  value={this.state.dt1.toString()}/>
                            </Item>  
                            <Button small transparent onPress={this._showDateTimePicker} >
                                <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this._handleDatePicked}
                                onCancel={this._hideDateTimePicker}
                                />
                                <Icon style={{ color:'#9ac9df',marginLeft:5}} name="calendar" type="FontAwesome"/>
                            </Button>

                            <Item regular style={{height:30, width:'30%',marginLeft:-5}}>
                                <Input editable = {false}  style={{ fontSize:12}}  value={this.state.dt2.toString()}/>
                            </Item>
                            <Button small transparent onPress={this._showDateTimePicker2} style={{ marginLeft:-5}} >
                                <DateTimePicker
                                    isVisible={this.state.isDateTimePickerVisible2}
                                    onConfirm={this._handleDatePicked2}
                                    onCancel={this._hideDateTimePicker2}
                                    />
                                <Icon style={{ color:'#9ac9df'}} name="calendar" type="FontAwesome"/>
                            </Button>
                            
                          
                            <Button small transparent onPress={() => this._reloadData()} >
                                <Icon style={{ color:'#9ac9df'}} name="search" type="FontAwesome"/>
                            </Button>
                           
                        </Left>
                        <Right>
                                <Button small iconRight transparent onPress={() => Actions.TransaksiAdd()} >
                                     <Icon style={{ color:'#9ac9df'}} name="shopping-basket" type="FontAwesome"/>
                                </Button>
                        </Right>
                </ListItem>
                    <Grid style={{backgroundColor: "#f6f6f6",borderColor:"#9ac9df",marginBottom:5, borderBottomWidth:1,borderTopWidth:1,marginTop:5, height:35}} >
                        <Col style={{width:'25%',textAlign:'center'}} >
                            <Text style={{marginLeft:10, marginTop:5}}>Date</Text>
                        </Col>
                        <Col style={{width:'25%',textAlign: 'right'}} >
                        <Text style={{textAlign: 'right', marginTop:5}}>Amount</Text>
                        </Col>
                        <Col style={{width:'25%',textAlign: 'right'}} >
                        <Text style={{textAlign: 'right', marginTop:5}}>Payment</Text>
                        </Col>
                        <Col style={{width:'25%'}}>
                        <Text style={{textAlign: 'right', marginTop:5}}>Discount</Text>
                        </Col>
                    </Grid>
                                <FlatList                    
                                    data={this.state.TransLists}
                                    renderItem={this._RenderItems}
                                    keyExtractor={(item,tgl) => item.tgl}
                                    ListEmptyComponent={this._ListEmpty}
                                />

                                <Grid style={{ backgroundColor: "#f6f6f6",borderColor:"#9ac9df", height:40,borderBottomWidth:1,borderTopWidth:0 }}>
                                    <Col style={{width:'12%',textAlign:'right'}}>
                                            <Button iconRight transparent onPress={() => this._printRekap()} >
                                                <Icon style={{ color:'#800080',fontSize:20,marginLeft:5}} name="print" type="Entypo"/>
                                            </Button>
                                    </Col>
                                    <Col style={{width:'13%',textAlign:'right'}}>
                                            <Button iconRight transparent onPress={() => this._exportFile()} >
                                                <Icon style={{ color:'#800080',fontSize:20}} name="file-excel-o" type="FontAwesome"/>
                                            </Button>
                                    </Col>

                                    <Col style={{width:'25%',textAlign: 'right',marginTop:10}} >
                                        <NumberFormat value={this.state.total_amount} displayType={'text'} thousandSeparator={true} renderText={value => <Text style={{textAlign: 'right'}}>{value}</Text>}/>
                                    </Col>
                                   
                                    <Col style={{width:'25%',textAlign: 'right',marginTop:10}}>
                                    <NumberFormat value={this.state.total_payment} displayType={'text'} thousandSeparator={true} renderText={value => <Text style={{textAlign: 'right'}}>{value}</Text>}/>
                                    
                                    </Col>
                                    <Col style={{width:'25%',textAlign:'right',marginTop:10}}>
                                    <NumberFormat value={this.state.total_diskon} displayType={'text'} thousandSeparator={true} renderText={value => <Text style={{textAlign: 'right'}}>{value}</Text>}/>
                                            
                                    </Col>

                                  
                                </Grid>

               

                </Content>
            </Container>
        );
    }

}