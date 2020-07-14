/*
*********
Created November 2018 By AK78 - yayasunarya@gmail.com
*********
===========================================
Big Thank to :
*/
import React, {Component} from 'react';
import { FlatList,Alert,View } from 'react-native';
import {Container, Content,List, ListItem, Left, Body, Right, Text,Item,Input,Icon,Button,Form,SwipeRow,Card,CardItem } from 'native-base';
import {Actions} from 'react-native-router-flux';
import getStyles from '../../assets/styles';
import {queryHistory,GetConfigName} from '../models/allSchemas';
import realm from '../models/allSchemas';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import DateTimePicker from 'react-native-modal-datetime-picker';

//import { SORT_ASCENDING, SORT_DESCENDING } from './sortStates';
import { Col, Row, Grid } from "react-native-easy-grid";
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

export default class History_delete extends React.Component {
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
            };
           // this._reloadData('x');
           // realm.addListener('change', () => {this._reloadData('x')}); 
        }
    
        componentDidMount = () =>{ this._reloadData('x');}
     
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
            queryHistory(this.state.qdt1,this.state.qdt2,ss_p,ee_p,this.state.searchedName).then((TransLists) => {
                this.setState({ TransLists });
            }).catch((error) => {
                this.setState({ TransLists: [] });
            });
           
            window.console.log('riload');
           
        }
        
       
        _RenderItems =({ item, index }) => (
                <SwipeRow
                leftOpenValue={0}
                rightOpenValue={0}
                style={index % 2 == 0 ? styles.sRowList1:styles.sRowList2}
               
                body={
                    <Grid style={{marginTop:-5, height:25}} >
                        <Col style={{width:'10%',textAlign:'left'}} >
                            <Icon name='infocirlce' type="AntDesign" style={{color: '#4caf50',marginLeft:8,fontSize:27}}/> 
                        </Col>
                        <Col style={{width:'45%',textAlign:'left'}} >
                            <Row> 
                                <Text style={{marginLeft:10}}>{this.state.NoINV}{item.gtid}</Text> 
                            </Row>
                            <Row> 
                                <Text style={{fontSize:10,marginLeft:10,fontStyle:'italic'}}>Notes : {item.notes_del}</Text> 
                            </Row>
                        </Col>
                        <Col style={{width:'45%'}}>
                            <Row style={{textAlign:'right',justifyContent:'flex-end'}}> 
                                
                            </Row>
                            <Row style={{textAlign:'right',justifyContent:'flex-end'}}> 
                                <Text style={{fontSize:10,textAlign: 'right',color:'#20B2AA',fontStyle:'italic'}}>{moment(item.trans_del).format("DD MMM YYYY hh:mm:ss")}</Text> 
                            </Row>
                            
                        </Col>
                    </Grid>
                    
                  }
                
            />
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
                                           
                                    </Col>
                                    <Col style={{width:'10%',textAlign:'left'}}>
                                          
                                    </Col>
                                </Grid>

                </Content>
            </Container>
        );
    }

}
