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
import {AsyncStorage, FlatList,Alert,View } from 'react-native';
import { Container, Content,List, ListItem, Left, Body, Right, Text,Item,Input,Icon,Button,Form,SwipeRow } from 'native-base';
import HeaderPage from './HeaderPage';
import {Actions} from 'react-native-router-flux';
import getStyles from '../../assets/styles';
import HeaderComponent from './HeaderComponent';
import {queryAllItems,deleteItemList,filterItemLists,updateItems,ItemsQTY} from '../models/allSchemas';
import realm from '../models/allSchemas';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { SORT_ASCENDING, SORT_DESCENDING } from './sortStates';
import { Col, Row, Grid } from "react-native-easy-grid";
import Dialog, {DialogTitle,DialogContent,DialogFooter,DialogButton} from 'react-native-popup-dialog';
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
const styles = getStyles();

export default class Items extends React.Component {
        state = {
            isLoading:false,
            modalVisible:false,
            searchedName:'',
            sortState: SORT_ASCENDING,
            ItemsLists: [],
            ItemsListsExcel:[],
            t_iid:0,
            t_icode:'',
            t_iname:'',
            t_price:0,
            t_hna :0,
            t_nomorlist :'',
            s_paging:ss_value,
            e_paging:ee_value,
            ItemsQTY_result:0,
            username:'',
            userid:'',
            isHidden:false
       }
  
   getData = async () => {
       try {
         const dlog = await AsyncStorage.getItem('@data');
             JSON.parse(dlog, (key, value) => {
               if (key==='username') this.setState({username:value});
               if (key==='userid') this.setState({userid:value});
               if (value==='2') this.setState({isHidden:true});
             });
      } catch(e) {
         // error reading value
       }
     }


        componentDidMount = () =>{
            this.getData();
            this.setState({isLoading:true},this._getDB());
            
        }
        _getDB=() =>{
            this._reloadData(this.state.searchedName,'x');
            realm.addListener('change', () => {this._reloadData(this.state.searchedName,'x')}); 
        }
        
      /*  _sort = () => {
            this.setState({ 
                sortState: this.state.sortState === SORT_ASCENDING ? SORT_DESCENDING : SORT_ASCENDING,
                ItemsLists: this.state.ItemsLists.so.sorted("iname", this.state.sortState === SORT_DESCENDING ? true : false)
            });
        }
       */
        
        _reloadData = (searchedText,prevnext) => {
            var ss_p=this.state.s_paging;
            var ee_p=this.state.e_paging;
            if (prevnext==='v_next') 
                {ss_p=ss_p+ee_value+1;ee_p=ee_p+ee_value+1;}
            if (prevnext==='v_prev') 
            {ss_p=ss_p-ee_value-1;ee_p=ee_p-ee_value-1;}

            this.setState({ s_paging:ss_p,e_paging:ee_p });
            queryAllItems(searchedText,ss_p,ee_p).then((ItemsLists) => {
                this.setState({ ItemsLists });
            }).catch((error) => {
                this.setState({ ItemsLists: [] });
            });
            ItemsQTY(searchedText).then((ItemsQTY_result) => {
                this.setState({ ItemsQTY_result });
            }).catch((error) => {
                this.setState({ ItemsQTY_result: 0 });
            });
            //console.log('reloadData');
        }

        _RenderItems =({ item, index }) => (
            <SwipeRow
                leftOpenValue={60}
                rightOpenValue={-50}
                style={index % 2 == 0 ? styles.sRowList1:styles.sRowList2}
                left={
                    <Button success onPress={() => this._showEdit(true,item)}>
                        <Icon active name="edit" type="FontAwesome" />
                    </Button>
                }
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
                                <Text style={{fontSize:10,marginLeft:10,fontStyle:'italic'}}>Code : {item.icode}</Text> 
                            </Row>
                        </Col>
                        <Col style={{width:'25%'}}>
                            <Row style={{textAlign:'right',justifyContent:'flex-end'}}> 
                                <NumberFormat value={item.price} displayType={'text'} thousandSeparator={true} renderText={value => <Text style={{textAlign: 'right'}}>{value}</Text>}/>
                            </Row>
                            <Row style={{textAlign:'right',justifyContent:'flex-end'}}> 
                                <Text style={{fontSize:10,textAlign: 'right',color:'#4caf50',fontStyle:'italic'}}>{moment(item.modify_time).format("DD MMM YYYY HH:mm:ss")}</Text> 
                            </Row>
                        </Col>
                    </Grid>
                    
                    
                  }
                right={
                    <Button danger onPress={() => {this._DeleteConfirmation(item.icode,item.iid)}}>
                        <Icon active name="trash"  />
                    </Button>
                }
            />
        );
        _addItem = () =>{
            if(this.state.userid===2)
            {
                alert('Access Denied');
                return false;
            }
            else
            {Actions.Items();}
        }
        _DeleteConfirmation = (icode,iid) => {
            if(this.state.userid===2)
            {
                alert('Access Denied');
                return false;
            }
            else
            {
                    Alert.alert(
                        'Delete',
                        'Are you Sure ... delete an Item with Code : '+icode+ ' ?',
                        [
                            {
                                text: 'No', onPress: () => { },//Do nothing
                                style: 'cancel'
                            },
                            {
                            text: 'Yes', onPress: () => {
                                deleteItemList(iid).then().catch(error => {
                                    alert(`Failed to delete Item with ItemCode = ${icode}, error=${error}`);
                                });
                            }
                            },
                        ],
                        { cancelable: true }
                    );
            }

        };
        _showEdit = (visible,ListData) => {
            //window.console.log(this.state.userid);
            if(this.state.userid===2)
            {
                alert('Access Denied');
                return false;
            }
            else
            {
               this.setState(
                        {
                            modalVisible:visible,
                            t_iid:ListData.iid,
                            t_icode:ListData.icode,
                            t_iname:ListData.iname,
                            t_hna:ListData.harga_beli,
                            t_price:ListData.price,
                            t_nomorlist:ListData.nomorlist,
                });
            }     
        }
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
        itemsUpdate = () => {
            var that = this;
            const { t_icode } = this.state;
            const { t_iname } = this.state;
            const { t_price } = this.state;
            const { t_hna } = this.state;
            const { t_nomorlist } = this.state;
            if (t_icode) {
              if (t_iname) {
               
                Alert.alert(
                  'Save',
                  'Update Data Item ?',
                  [
                    {
                      text: 'No',
                      onPress: () => { }
                    } ,   
                    {
                      text: 'Yes',
                      onPress: () => {
                         
                                const UpdateItems = {
                                  iid   : this.state.t_iid,
                                  icode : t_icode,
                                  iname : t_iname,
                                  price : parseFloat(t_price),
                                  harga_beli:parseFloat(t_hna),
                                  nomorlist: t_nomorlist==='' ? 0 : parseFloat(t_nomorlist),
                              };
                              updateItems(UpdateItems).then().catch((error) => {
                                  alert(`Update Item :  error ${error}`);
                                  });
                                  Alert.alert(
                                    'Success',
                                    'Successfully',
                                    [
                                      {
                                        text: 'Ok',
                                        onPress: () => {
                                            Actions.ItemsList();
                                            this.setState({ modalVisible: false });
                                        },
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
        onChanged(e){
            if (/^\d+$/.test(e.toString())) { 
              this.setState({ t_price: e });
            }
        }
        onChangedNomor(e){
            if (/^\d+$/.test(e.toString())) { 
              this.setState({ t_nomorlist: e });
            }
        }
        onChangedhna(e){
            if (/^\d+$/.test(e.toString())) { 
              this.setState({ t_hna: e });
            }
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
                        filterItemLists(this.state.searchedName).then((ItemsListsExcel) => {
                            var _ddata=ItemsListsExcel;
                            var ArrNew=[];
                            var i=1;
                            var push_data=[]; 
                                ArrNew[0]='No';
                                ArrNew[1]='Kode Barang';
                                ArrNew[2]='Nama barang';
                                ArrNew[3]='Harga Beli';
                                ArrNew[4]='Harga Jual';
                                push_data.push(ArrNew);
                                ArrNew=[];
                            _ddata.forEach(function(array2) {
                                ArrNew[0]=i;
                                ArrNew[1]=array2.icode;
                                ArrNew[2]=array2.iname;
                                ArrNew[3]=array2.harga_beli;
                                ArrNew[4]=array2.price;
                                i=i+1;
                                push_data.push(ArrNew);
                                ArrNew=[];
                            });
                            const ws = XLSX.utils.aoa_to_sheet(push_data);
                            const wb = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
                            /* write file  */
                            const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});
                            const file = DDP + "DataBarang.xlsx";
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
render() {
        return (
            <Container>
                <HeaderPage/>
                <Content padder>
                    <ListItem noIndent style={{ backgroundColor: "#f6f6f6" }}>
                        <Left>
                            <Item>
                                <Icon  style = {styles.text_menu} name='search' />
                                <Input placeholder="Enter text to search" autoCorrect={false}
                                    onChangeText={(text) => {
                                    this.setState({ searchedName: text });
                                    this.setState({ s_paging:ss_value,e_paging:ee_value });
                                    this._reloadData(text,'x');
                                    }} 
                                value={this.state.searchedName}
                                />
                            </Item>
                        </Left>
                        
                        <Right>
                                <Button small iconRight transparent onPress={() => this._addItem()} >
                                     <Icon style={{ color:'#9ac9df'}} name="plus" type="FontAwesome"/>
                                </Button>
                        </Right>
                    </ListItem>

                   
                                <FlatList                    
                                    data={this.state.ItemsLists}
                                    renderItem={this._RenderItems}
                                    keyExtractor={(item,iid) => item.icode}
                                    ListEmptyComponent={this._ListEmpty}
                                />

                    <Grid style={{ backgroundColor: "#f6f6f6", height:40 }}>
                        <Col style={{width:'15%'}} >
                            <Button iconRight transparent onPress={() => this._reloadData(this.state.searchedName,'v_prev')} >
                                <Icon style={{ color:'#9ac9df'}} name="long-arrow-left" type="FontAwesome"/>
                            </Button>
                        </Col>
                        <Col style={{width:'15%'}} >
                            <Button iconRight transparent onPress={() => this._reloadData(this.state.searchedName,'v_next')} >
                                <Icon style={{ color:'#9ac9df'}} name="long-arrow-right" type="FontAwesome"/>
                            </Button>       
                       </Col>
                       <Col style={{width:'60%'}}>
                            <Text style={{color:'#ff9800',marginTop:10,fontWeight:"bold"}}>
                             Total Items : {this.state.ItemsQTY_result}
                            </Text>
                       </Col>
                       <Col style={{width:'10%',textAlign:'left'}}>
                            <Button iconRight transparent onPress={() => this._exportFile()} >
                                <Icon style={{ color:'#9ac9df'}} name="file-excel-o" type="FontAwesome"/>
                            </Button>
                       </Col>
                    </Grid>

                    
                    <View style={{width:'90%'}}>
                          <Dialog
                            onDismiss={() => {
                            this.setState({ modalVisible: false });
                            }}
                        width={0.9}
                        visible={this.state.modalVisible}
                        rounded
                        actionsBordered
                        dialogTitle={
                            <DialogTitle
                            title="Edit Data "
                            style={{
                                backgroundColor: '#F7F7F8',
                            }}
                            hasTitleBar={false}
                            align="left"
                            />
                        }
                        footer={
                            <DialogFooter>
                            <DialogButton
                                text="CANCEL"
                                bordered
                                onPress={() => {
                                this.setState({ modalVisible: false });
                                }}
                                key="button-1"
                            />
                            <DialogButton
                                text="SAVE"
                                bordered
                                onPress={() => {
                                this.itemsUpdate(this);
                                }}
                                key="button-2"
                            />
                            </DialogFooter>
                        }
                        >
                        <DialogContent
                            style={{
                            backgroundColor: '#F7F7F8',
                            }}
                        >
                            <Form >
                                <Item regular style = {styles.text_input}>
                                    <Icon active name='barcode' type='FontAwesome' style = {styles.text_muted}/>
                                    <Input editable={false} value={this.state.t_icode} onChangeText={t_icode => this.setState({ t_icode })}/>
                                </Item>

                                <Item regular style = {styles.text_input}>
                                    <Icon active name='book' type='FontAwesome' style = {styles.text_muted}/>
                                    <Input value={this.state.t_iname} onChangeText={t_iname => this.setState({ t_iname })}/>
                                </Item>

                                <Item regular style = {styles.text_input}>
                                    <Icon active name='money' type='FontAwesome' style = {styles.text_muted}/>
                                    <Input value={this.state.t_hna.toString()}   keyboardType='numeric' maxLength={10} 
                                        onChangeText = {(e)=> this.onChangedhna(e)} placeholder='Purchase Price' 
                                     />
                                </Item>

                                <Item regular style = {styles.text_input}>
                                    <Icon active name='money' type='FontAwesome' style = {styles.text_muted}/>
                                    <Input value={this.state.t_price.toString()} keyboardType='numeric' maxLength={10} 
                                           onChangeText = {(e)=> this.onChanged(e)}/>
                                </Item>
                                <Item regular style = {styles.text_input}>
                                    <Icon active name='list-ul' type='FontAwesome' style = {styles.text_muted}/>
                                    <Input value={this.state.t_nomorlist.toString()} keyboardType='numeric' maxLength={2} 
                                           onChangeText = {(e)=> this.onChangedNomor(e)}/>
                                </Item>
                            </Form>
                        </DialogContent>
                        </Dialog>
                    </View>

                </Content>
            </Container>
        );
    }

}
