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

//import { SORT_ASCENDING, SORT_DESCENDING } from './sortStates';
import { Col, Row, Grid } from "react-native-easy-grid";
import Dialog, {DialogTitle,DialogContent,DialogFooter,DialogButton} from 'react-native-popup-dialog';
//import {BluetoothEscposPrinter} from "react-native-bluetooth-escpos-printer";
/*==excel=*/
import XLSX from 'xlsx';
// react-native-fs
import { writeFile, readFile } from 'react-native-fs';
import RNFS from 'react-native-fs';
const DDP = RNFS.ExternalDirectoryPath +"/";
const input = res => res;
const output = str => str;
const ss_value=0;
const ee_value=20;
const getinv='noinv';
const styles = getStyles();

export default class TransaksiList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                isLoading:false,
                modalVisible:false,
                searchedName:'',
                //sortState: SORT_ASCENDING,
                TransLists: [],
                TransListsExcel:[],
                s_paging:ss_value,
                e_paging:ee_value,
                dt1 :moment(new Date()).format('DD-MM-YYYY'),
                dt2 :moment(new Date()).format('DD-MM-YYYY'),
                qdt1: new Date(),
                qdt2: new Date(),
                NoINV:'',
                dcname:'',
                TransListsDetail:[],
                ItemsListsExcel:[],
                configsLists:[],
                transh:[],
            };
           // this._reloadData('x');
           // realm.addListener('change', () => {this._reloadData('x')}); 
        }
    
        componentDidMount = () =>{ this._reloadData('x');}
       /* _getDB=() =>{
            this._reloadData('x');
            realm.addListener('change', () => {this._reloadData('x')}); 
            }
        _sort = () => {
            this.setState({ 
                sortState: this.state.sortState === SORT_ASCENDING ? SORT_DESCENDING : SORT_ASCENDING,
                TransLists: this.state.TransLists.sorted("gtid", this.state.sortState === SORT_DESCENDING ? true : false)
            });
        }*/
    
        _reloadData = (prevnext) => {
            GetConfigName(getinv).then((dcname) => {
                this.setState({ NoINV: dcname });
            }).catch((error) => {
                this.setState({ NoINV: 'xx' });
            });

            var ss_p=this.state.s_paging;
            var ee_p=this.state.e_paging;
            if (prevnext==='v_next') 
                {ss_p=ss_p+ee_value+1;ee_p=ee_p+ee_value+1;}
            if (prevnext==='v_prev') 
                {ss_p=ss_p-ee_value-1;ee_p=ee_p-ee_value-1;}

            this.setState({s_paging:ss_p,e_paging:ee_p});
            queryAllTrans(this.state.qdt1,this.state.qdt2,ss_p,ee_p,this.state.searchedName).then((TransLists) => {
                this.setState({ TransLists });
            }).catch((error) => {
                this.setState({ TransLists: [] });
            });
           
            window.console.log('roload');
           
        }
        showPayment=(Listdata) =>
        {
            
            if (Listdata.is_payed===true) {alert('AlReady payed !!!');return false;}
            
            DetailTransaksi(Listdata.gtid).then((TransListsDetail) => {
                Actions.TransaksiPayment({ databill: Listdata.amount, nomorinv: Listdata.gtid,dataitems:TransListsDetail,atasnama:Listdata.cust_name});
            }).catch((error) => {
                this.setState({ TransListsDetail: [] });
            });

           
            //Actions.TransaksiPayment({ databill: this.state.i_total, nomorinv: this.state.nomor_gtid,dataitems:push_data,atasnama:this.state.atasnama});                      
        }

       
        _RenderItems =({ item, index }) => (
                <SwipeRow
                leftOpenValue={120}
                rightOpenValue={-180}
                style={index % 2 == 0 ? styles.sRowList1:styles.sRowList2}
                left={
                    <Grid>
                        <Col>
                            <Button danger onPress={() => {this._DeleteConfirmation(item.gtid,item.is_payed)}}>
                                <Icon active name="closecircle" type="AntDesign"  />
                            </Button>
                        </Col>
                        <Col>
                            <Button warning onPress={() => {this._DeletePayment(item.gtid,item.is_payed)}}>
                                <Icon active name="delete" type="AntDesign"  />
                            </Button>
                        </Col>
                    </Grid>
                    
                }
                body={
                    <Grid style={{marginTop:-5, height:25}} >
                        <Col style={{width:'10%',textAlign:'left'}} >
                            <Icon name='infocirlce' type="AntDesign" style={{color: item.is_payed===true ? '#4caf50':'#ff9800',marginLeft:8,fontSize:27}}/> 
                        </Col>
                        <Col style={{width:'45%',textAlign:'left'}} >
                            <Row> 
                                <Text style={{marginLeft:10}}>{this.state.NoINV}{item.gtid}{item.is_payed}</Text> 
                            </Row>
                            <Row> 
                                <Text style={{fontSize:10,marginLeft:10,fontStyle:'italic'}}>cn : {item.cust_name}</Text> 
                            </Row>
                        </Col>
                        <Col style={{width:'45%'}}>
                            <Row style={{textAlign:'right',justifyContent:'flex-end'}}> 
                                <NumberFormat value={item.amount} displayType={'text'} thousandSeparator={true} renderText={value => <Text style={{textAlign: 'right'}}>{value}</Text>}/>
                            </Row>
                            <Row style={{textAlign:'right',justifyContent:'flex-end'}}> 
                                <Text style={{fontSize:10,textAlign: 'right',color:'#20B2AA',fontStyle:'italic'}}>{moment(item.modify_time).format("DD MMM YYYY hh:mm:ss")}</Text> 
                            </Row>
                            
                        </Col>
                    </Grid>
                    
                  }
                right={
                    <Grid>
                        <Col>
                            <Button warning onPress={() => this.showDetailTransaksi(true,item)}>
                                <Icon active name="edit" type="FontAwesome" />
                            </Button>
                        </Col>
     
                        <Col> 
                            <Button success onPress={ () => this._printStruck(item)}>
                                <Icon active name="printer" type="AntDesign"/>
                            </Button>
                        </Col>
                        <Col>
                            <Button danger onPress={() => this.showPayment(item)}>
                                <Icon active name="dollar" type="FontAwesome"/>
                            </Button>
                        </Col>
                    </Grid>
                    }
            />
        );

        _DeleteConfirmation = (gtid,is_payed) => {
            if (is_payed===true) {alert('AlReady payed !!!');return false;}
            Alert.alert(
                'Delete',
                'Are you Sure ... delete Invoice  : '+gtid+ ' ?',
                [
                    {
                        text: 'No', onPress: () => { },//Do nothing
                        style: 'cancel'
                    },
                    {
                      text: 'Yes', onPress: () => {
                        deleteTrans(gtid).then().catch(error => {
                              alert(`Failed to delete Invoice : ${iid}, error=${error}`);
                          });
                      }
                    },
                ],
                { cancelable: true }
            );
        };

        _DeletePayment = (gtid,is_payed) => {
            if (is_payed===false) 
            {
                alert('Please Payment Firts !!!');return false;
            }
           
            Alert.alert(
                    'Delete',
                    'Are you Sure ... Delete Payment Invoice  : '+gtid+ ' ?',
                    [
                        {
                            text: 'No', onPress: () => { },//Do nothing
                            style: 'cancel'
                        },
                        {
                          text: 'Yes', onPress: () => {
                            Actions.TransaksiPaymentDelete({ gtid: gtid});
                          }
                        },
                    ],
                    { cancelable: true }
                );
        };
     
 
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
                        queryExportTrans(this.state.qdt1,this.state.qdt2).then((ItemsListsExcel,noinv=this.state.NoINV) => {
                            var _ddata=ItemsListsExcel;
                            var ArrNew=[];
                            var i=1;var sum_amount=0;var sum_payment=0;var sum_diskon=0;
                            var push_data=[]; 
                                ArrNew[0]='No';
                                ArrNew[1]='Trans Date';
                                ArrNew[2]='No Invoice';
                                ArrNew[3]='Customer Name';
                                ArrNew[4]='Amount';
                                ArrNew[5]='Payed';
                                ArrNew[6]='Payment';
                                ArrNew[7]='Discount';
                                ArrNew[8]='Cash';
                                ArrNew[9]='Charges';
                                push_data.push(ArrNew);
                                ArrNew=[];
                            _ddata.forEach(function(array2) {
                                ArrNew[0]=i;
                                ArrNew[1]=moment(array2.trans_date).format('DD-MM-YYYY hh:mm:ss');
                                ArrNew[2]=noinv+array2.gtid;
                                ArrNew[3]=array2.cust_name;
                                ArrNew[4]=array2.amount;
                                ArrNew[5]=array2.is_payed;
                                ArrNew[6]=array2.amount_payment;
                                ArrNew[7]=array2.amount_diskon;
                                ArrNew[8]=array2.amount_cash;
                                ArrNew[9]=array2.amount_charge;
                                i=i+1;
                                sum_amount += array2.amount;
                                sum_payment += array2.amount_payment;
                                sum_diskon += array2.amount_diskon;

                                push_data.push(ArrNew);
                                ArrNew=[];
                            });
                            ArrNew[0]='';
                            ArrNew[1]='';
                            ArrNew[2]='';
                            ArrNew[3]='TOTAL';
                            ArrNew[4]=sum_amount;
                            ArrNew[5]='';
                            ArrNew[6]=sum_payment;
                            ArrNew[7]=sum_diskon;
                            ArrNew[8]='';
                            ArrNew[9]='';
                            push_data.push(ArrNew);
                            ArrNew=[];
                            
                            const ws = XLSX.utils.aoa_to_sheet(push_data);
                            const wb = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
                            /* write file  */
                            const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});
                            const file = DDP + "ExportTransaksi.xlsx";
                            writeFile(file, output(wbout), 'ascii').then((res) =>{
                                    Alert.alert("exportFile success", "Exported to " + file);
                                    this.setState({ ItemsListsExcel: [] });
                            }).catch((err) => { Alert.alert("exportFile Error", "Error " + err.message); });
                        }).catch((error) => {
                            this.setState({ ItemsListsExcel: [] });
                        });  
                        
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

        showDetailTransaksi = (visible,ListData) => {
            this._reloadDataDetail(ListData.gtid);
            this.setState(
                {
                    modalVisible:visible,
                    name        : ListData.cust_name,
                    total_inv   : ListData.amount,
                    Nomor       : this.state.NoINV+ListData.gtid,
                    tgltrans    : moment(ListData.modify_time).format("DD MMM YYYY hh:mm:ss"),
                });
                
        }
        _reloadDataDetail = (gtid) => {
            DetailTransaksi(gtid).then((TransListsDetail) => {
                this.setState({ TransListsDetail });
            }).catch((error) => {
                this.setState({ TransListsDetail: [] });
            });
            
        }
        _RenderDetailTrans=({ item, index }) => (
            <SwipeRow
                leftOpenValue={60}
                rightOpenValue={-120}
                style={index % 2 == 0 ? styles.sRowList1:styles.sRowList2}
               
                body={
                    <Grid style={{marginTop:-5}} >
                        <Col style={{width:'10%',textAlign:'left'}} >
                        <Text style={styles.iconitem}>{item.iname.charAt(0).toUpperCase()}</Text>
                        </Col>
                        <Col style={{width:'65%',textAlign:'left'}} >
                            <Row> 
                                <Text style={{marginLeft:10}}>{item.iname}</Text> 
                            </Row>
                            <Row> 
                                <Text style={{fontSize:10,marginLeft:10,fontStyle:'italic'}}>qty : {item.vol}</Text> 
                            </Row>
                        </Col>
                        <Col style={{width:'25%'}}>
                            <Row style={{textAlign:'right',justifyContent:'flex-end'}}> 
                                <NumberFormat value={item.amount_subtotal} displayType={'text'} thousandSeparator={true} renderText={value => <Text style={{textAlign: 'right'}}>{value}</Text>}/>
                            </Row>
                            <Row style={{textAlign:'right',justifyContent:'flex-end'}}> 
                                <Text style={{fontSize:10,textAlign: 'right',color:'#20B2AA',fontStyle:'italic'}}>{moment(item.modify_time).format("DD MM YY hh:mm:ss")}</Text> 
                            </Row>
                        </Col>
                    </Grid>
             }
            
         />
        );
        _exportDetail() {
            Alert.alert(
                'Export Data',
                'Export Detail Data To Excell ?',
                [
                    {
                        text: 'No', onPress: () => { },//Do nothing
                        style: 'cancel'
                    },
                    {
                      text: 'Yes', onPress: () => {
                           
                        queryExportTrans(this.state.qdt1,this.state.qdt2).then((ItemsListsExcel,noinv=this.state.NoINV) => {
                            this.setState({ transh: ItemsListsExcel})
                        }).catch((error) => {});


                        queryExportTransDetail(this.state.qdt1,this.state.qdt2).then((ItemsListsExcel,noinv=this.state.NoINV) => {
                            var _ddata=ItemsListsExcel;
                            var _transH=this.state.transh;
                           
                           

                            
                            var ArrNew=[];
                            var i=1;
                            var push_data=[]; 
                                ArrNew[0]='No';
                                ArrNew[1]='Trans Date';
                                ArrNew[2]='No Invoice';
                                ArrNew[3]='Item Code';
                                ArrNew[4]='Item Name';
                                ArrNew[5]='Item Qty';
                                ArrNew[6]='Item Price';
                                ArrNew[7]='Amount';
                                ArrNew[8]='Discount';
                                push_data.push(ArrNew);
                                ArrNew=[];
                                total=0;$_gtid='';total_item=0;total_diskon=0;
                            _ddata.forEach(function(array2) {
                               

                                ArrNew[0]=i;
                                if ($_gtid===array2.gtid)
                                {
                                    ArrNew[1]='';
                                    ArrNew[2]='';
                                    ArrNew[8]=0;
                                }
                                else{
                                    const result = _transH.find( fruit => fruit.gtid === array2.gtid );
                                    ArrNew[1]=moment(array2.trans_date).format('DD-MM-YYYY hh:mm:ss');
                                    ArrNew[2]=noinv+array2.gtid;
                                    ArrNew[8]=result.amount_diskon;
                                    total_diskon =total_diskon+result.amount_diskon;
                                    //window.console.log(result);
                                }
                                ArrNew[3]=array2.icode;
                                ArrNew[4]=array2.iname;
                                ArrNew[5]=array2.vol;
                                ArrNew[6]=array2.amount_price;
                                ArrNew[7]=array2.amount_subtotal;
                                i=i+1;
                                push_data.push(ArrNew);
                                total =total+array2.amount_subtotal;
                                
                                total_item =total_item+array2.vol;
                                $_gtid=array2.gtid;
                                ArrNew=[];
                            });
                                ArrNew[0]='';ArrNew[1]='';ArrNew[2]='';ArrNew[3]='';
                                ArrNew[4]='TOTAL';ArrNew[5]=total_item;ArrNew[6]='';
                                ArrNew[7]=total;
                                ArrNew[8]=total_diskon;
                                push_data.push(ArrNew);
                                ArrNew=[];

                            const ws = XLSX.utils.aoa_to_sheet(push_data);
                            const wb = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
                            /* write file  */
                            const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});
                            const file = DDP + "ExportDetailTransaksi.xlsx";
                            writeFile(file, output(wbout), 'ascii').then((res) =>{
                                    Alert.alert("exportFile success", "Exported to " + file);
                                    this.setState({ ItemsListsExcel: [] });
                            }).catch((err) => { Alert.alert("exportFile Error", "Error " + err.message); });
                        }).catch((error) => {
                            this.setState({ ItemsListsExcel: [] });
                        });  
                        
                      }
                    },
                ],
                { cancelable: true }
            );
            
    
        };
        
     _printStruck =  async (Listdata)  => 
        {
            if (Listdata.is_payed===false) {alert('Please Payment first !!');return false;}
            
            queryConfigs().then((configsLists) => {
                this.setState({ configsLists });
              }).catch((error) => {
                  this.setState({ configsLists: [] });
              });

            DetailTransaksi(Listdata.gtid).then((TransListsDetail) => { 
               this.setState({TransListsDetail})
            }).catch((error) => {
                this.setState({ TransListsDetail: [] });
            });

            try { 
                await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
              } catch (e) {
                alert("Bluetooth Printer Not Connected !");
                return false;
              }
              
              var rows=this.state.TransListsDetail;
              var ddata=this.state.configsLists;
              var noi='';var promo='';
              for (let i in ddata) {
                let row = ddata[i];
                 if (row.cname==='namatoko') {  await BluetoothEscposPrinter.printText( row.cdata + "\r\n", {});}
                 if (row.cname==='alamattoko') { await  BluetoothEscposPrinter.printText( row.cdata + "\r\n", {});} 
                 if (row.cname==='nomortlp') { await  BluetoothEscposPrinter.printText( row.cdata + "\r\n", {});}
                 if (row.cname==='noinv') {noi=row.cdata;}
                 if (row.cname==='promo') {promo=row.cdata;}
               }
            atnama=(Listdata.cust_name ==='' || Listdata.cust_name ==='No Name')?'':'  CN:'+Listdata.cust_name;
           
            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
            await BluetoothEscposPrinter.printText("--------------------------------\r\n", {});
            await BluetoothEscposPrinter.printText(noi+Listdata.gtid+" "+ moment(Listdata.modify_time).format('DD-MM-YYYY hh:mm:ss')  + "\r\n", { fonttype: 2});
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
              ["TOTAL",":",Listdata.amount.toString()],{});
              await BluetoothEscposPrinter.printColumn([19, 2, 11],
                [BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.RIGHT],
                ["DISCOUNT",":",Listdata.amount_diskon.toString()],{});
                await  BluetoothEscposPrinter.printColumn([19, 2, 11],
              [BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.RIGHT],
              ["CASH",":",Listdata.amount_cash.toString()],{});
              await  BluetoothEscposPrinter.printColumn([19, 2, 11],
            [BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.RIGHT],
            ["CHANGE",":",Listdata.amount_charge.toString()],{});
            await BluetoothEscposPrinter.printText("--------------------------------\r\n", {});
            await  BluetoothEscposPrinter.printText("Total Items :"+toti.toString()+atnama+"\r\n", {});
            await  BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
            await  BluetoothEscposPrinter.printText(promo + "\r\n", {});
            await BluetoothEscposPrinter.printText(" Printed At : "+ moment(new Date()).format('DD-MM-YYYY hh:mm:ss')  + "\r\n\r\n", { fonttype: 1});
            
        }

render() {
        return (
            <Container>
                
                <Content padder>
                <ListItem noIndent style={{ backgroundColor: "#f6f6f6", marginLeft:0}}>
                        <Left >
                            <Item regular style={{height:30, width:'25%',marginLeft:-10}}>
                                 <Input editable = {false} style={{ fontSize:12}}  value={this.state.dt1.toString()}/>
                            </Item> 

                            <Button small transparent onPress={this._showDateTimePicker} >
                                <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this._handleDatePicked}
                                onCancel={this._hideDateTimePicker}
                                />
                                <Icon style={{ color:'#9ac9df',marginLeft:5}} name="calendar" type="FontAwesome"/>
                            </Button>

                            <Item regular style={{height:30, width:'25%',marginLeft:-5}}>
                                <Input editable = {false}  style={{ fontSize:12}}  value={this.state.dt2.toString()}/>
                            </Item> 
                            <Button small transparent onPress={this._showDateTimePicker2} style={{ marginLeft:-5}} >
                                <DateTimePicker
                                    isVisible={this.state.isDateTimePickerVisible2}
                                    onConfirm={this._handleDatePicked2}
                                    onCancel={this._hideDateTimePicker2}
                                    />
                                <Icon style={{ color:'#9ac9df',marginLeft:10}} name="calendar" type="FontAwesome"/>
                            </Button>
                            
                            <Item regular style={{height:30, width:'20%'}}>
                                <Input placeholder="No inv"  onChangeText={(text) => {this.setState({ searchedName: text });}}  style={{ fontSize:12}}  value={this.state.searchedName}/>
                            </Item>   
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
    
                                <FlatList                    
                                    data={this.state.TransLists}
                                    renderItem={this._RenderItems}
                                    keyExtractor={(item,gtid) => item.gtid.toString()}
                                    ListEmptyComponent={this._ListEmpty}
                                />

                                <Grid style={{ backgroundColor: "#f6f6f6",borderColor:"#9ac9df", height:40,borderBottomWidth:1,borderTopWidth:0 }}>
                                    <Col style={{width:'15%'}} >
                                        <Button style={{marginLeft:8}} iconRight transparent onPress={() => this._reloadData('v_prev')} >
                                            <Icon style={{ color:'#ff9800'}} name="long-arrow-left" type="FontAwesome"/>
                                        </Button>
                                    </Col>
                                    <Col style={{width:'15%'}} >
                                        <Button iconRight transparent onPress={() => this._reloadData('v_next')} >
                                            <Icon style={{ color:'#ff9800'}} name="long-arrow-right" type="FontAwesome"/>
                                        </Button>       
                                    </Col>
                                    <Col style={{width:'40%'}}>
                                    </Col>
                                    <Col style={{width:'10%',textAlign:'left'}}>
                                            
                                    </Col>

                                    <Col style={{width:'10%',textAlign:'left'}}>
                                            <Button iconRight transparent onPress={() => this._exportDetail()} >
                                                <Icon style={{ color:'#800080',fontSize:20}} name="files-o" type="FontAwesome"/>
                                            </Button>
                                    </Col>
                                    <Col style={{width:'10%',textAlign:'left'}}>
                                            <Button iconRight transparent onPress={() => this._exportFile()} >
                                                <Icon style={{ color:'#800080',fontSize:20}} name="file-excel-o" type="FontAwesome"/>
                                            </Button>
                                    </Col>
                                </Grid>

                <View style={{width:'90%'}}>
                            <Dialog
                                onDismiss={() => {this.setState({ modalVisible: false });}}
                                width={1}
                                visible={this.state.modalVisible}
                                actionsBordered
                                dialogTitle={
                                    <Card transparent style={{width:"95%"}}>
                                    <CardItem  style={{marginLeft:10}}>
                                        <Left>
                                            <Icon name='infocirlce' type="AntDesign" style={{color:'#462749',fontSize:30}}/> 
                                            <Body>
                                                <Text style={{color:'#462749'}} >{this.state.Nomor}</Text>
                                                <Text note style={{fontSize:9,fontStyle:"italic",color:'#800080'}}>cn:{this.state.name}</Text>
                                            </Body>
                                        </Left>
                                        <Right>
                                        <NumberFormat value={this.state.total_inv} displayType={'text'} thousandSeparator={true} renderText={value => <Text style={{textAlign: 'right',fontSize:30}}>{value}</Text>}/>
                                        </Right>
                                    </CardItem>
                                </Card>
                                }
                                
                            >
                            <DialogContent style={{ backgroundColor: '#F7F7F8'}}>
                                
                                
                                        <FlatList                    
                                            data={this.state.TransListsDetail}
                                            renderItem={this._RenderDetailTrans}
                                            keyExtractor={(item,gtdid) => item.gtdid.toString()}
                                            ListEmptyComponent={this._ListEmpty}
                                        />   
                                    <Button style={{marginTop:10,backgroundColor:'#f15a23'}} block onPress={() =>this.setState({ modalVisible: false })}>
                                        <Text style={{ color:'#ffffff' }} >CLOSE </Text>
                                    </Button>
                            </DialogContent>
                            </Dialog>
                </View>

                </Content>
            </Container>
        );
    }

}
