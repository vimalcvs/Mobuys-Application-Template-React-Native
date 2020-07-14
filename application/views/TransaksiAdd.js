import React, { Component } from 'react'; 
import { FlatList, Text, View, Alert,BackHandler } from 'react-native';
import {Card,CardItem, Container, List,ListItem,Left,Right,Body, Content, Button, Icon,Item,Input,Form,StyleProvider } from 'native-base'; 
import NumberFormat from 'react-number-format';
import Dialog, {DialogTitle,DialogContent,DialogFooter,DialogButton} from 'react-native-popup-dialog';
import getTheme from '../../native-base-theme/components';
import commonColor from '../../native-base-theme/variables/commonColor';
import {insertNewTrans,insertNewTrans_detail,queryBlockItems,filterItemLists,GetMaxgtid,GetDataRegsLenght} from '../models/allSchemas';
import getStyles from '../../assets/styles';
import {Actions} from 'react-native-router-flux';
import moment from 'moment';
import { Col, Row, Grid } from "react-native-easy-grid";
import {AsyncStorage} from 'react-native';
const styles = getStyles();

let FlatListItem = props => {
    const {itemIndex,iid, iname, icode,price,modify_time,onPressItem } = props;
    return (
              <List style={{ backgroundColor: itemIndex % 2 == 0 ? '#f0f0f0' : '#f6f6f6' }} >
                  <ListItem avatar keyExtractor={iid} button onPress={onPressItem}>
                          <Left><Text></Text></Left>
                          <Body style={{ marginLeft:-10}}>
                              <Text style={{ color:'#474747'}}>{iname}</Text>
                              <Text style={{ fontSize: 10,color:'#f15a23'}} note numberOfLines={1}><Text style={{ fontSize: 10}}>Code : </Text> {icode}</Text> 
                          </Body>
                          <Right>
                              <NumberFormat value={price} displayType={'text'} thousandSeparator={true} renderText={value => <Text>{value}</Text>}/>
                              <Text note style={{ fontSize: 9 }} numberOfLines={1}>{modify_time.toLocaleString()}</Text>
                          </Right>
                  </ListItem>
            </List>
      
    );
  }
export default class TransaksiAdd extends React.Component {
    constructor(props) {
        super(props);
        this.array = [],
        this.state = {
             arrayShopping: [],
             ItemsLists: [],
             i_code     : '',
             i_name     : '',
             i_price    : 0,
             i_qty      : 1,
             i_total    : 0,
             i_total_item: 0,
             i_hna      :0,
             modalVisible: false,
             modalListVisible: false,
             nomor_gtid :0,
             atasnama:'',
             username:'',
             userid:'',
             isHidden:true,
             BlockItems: [],
             BlockVisible: false,
        }
       
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

    reloadData = () => {
      queryBlockItems().then((BlockItems) => {
          this.setState({ BlockItems });
      }).catch((error) => {
          this.setState({ BlockItems: [] });
      });
      console.log(`reloadData BLock items`);
    }

    handleBackButtonClick = () => {
        this.setState({ modalListVisible: false });
        GetDataRegsLenght().then((regis) => {
            //window.console.log(regis);
            if (regis <= 0)
            {
                alert('Please Registration');
                Actions.RegAlert();  
            }
            
        }).catch((error) => {
           alert('ERROR');
           Actions.RegAlert();
        });
        this.props.navigation.goBack(null);
        return false;
    };
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
      }

    componentDidMount() {
        GetDataRegsLenght().then((regis) => {
            //window.console.log(regis);
            if (regis <= 0)
            {
                alert('Please Registration');
                Actions.RegAlert();  
            }

           
            
        }).catch((error) => {
           alert('ERROR');
           Actions.RegAlert();
        });
         this.setState({ arrayShopping: [...this.array], ItemsLists: [] });
         this.getData();
         this.reloadData();
         BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
      }

    joinData = () => {
        if(this.state.i_name==='')
        {
            alert('Please Fill with data First - Item Name !');
            return false;
        }
        if(parseFloat(this.state.i_price)===0)
        {
            alert('Please Fill with data First - Item Price !');
            return false;
        }
        var sub_tot=parseFloat(this.state.i_qty)*parseFloat(this.state.i_price);
        var iqty=parseFloat(this.state.i_qty);
        var isketemu=false;
        
        for (let i=0; i<this.array.length; i++) {
            if((this.array[i].v_name===this.state.i_name) && (this.array[i].v_price===parseFloat(this.state.i_price)))
            {
                    this.array[i].v_qty +=parseFloat(this.state.i_qty);
                    this.array[i].v_sub_tot +=sub_tot;
                    isketemu=true;
            }
         
          }
          if(isketemu===false)
          {
            this.array.push(
                {   
                    v_code  : this.state.i_code,
                    v_name  : this.state.i_name,
                    v_price : parseFloat(this.state.i_price),
                    v_qty   : parseFloat(this.state.i_qty),
                    v_sub_tot : parseFloat(sub_tot), 
                });
          }
            
        this.setState({ arrayShopping: [...this.array] });
        if(isketemu){this._sum_item(0,0);}
        else
        {this._sum_item(sub_tot,iqty);}
        
        this.setState({ i_name: '',i_price:'0',i_qty:'1',i_code:'' });
        this.setState({ modalVisible: false });
      }

    joinToDialog = (ListData) => {
         this.setState(
            { 
                modalVisible: true,
                i_name  :ListData.iname,
                i_price :ListData.price.toString(),
                i_qty   :'1',
                i_code :ListData.icode,
                modalListVisible: false,
                BlockVisible:false,
                i_hna : ListData.harga_beli.toString(),
        });
      }

    deleteItems = (index) => {
        
        var _ddata=this.array;  
        _ddata.splice(index,1);
        var initialValue = 0;
        var summ = _ddata.reduce(
            (accumulator, currentValue) => accumulator + currentValue.v_sub_tot
            ,initialValue
        );
        var summ_item = _ddata.reduce(
          (accumulator, currentValue) => accumulator + currentValue.v_qty
          ,initialValue
      );

        this.setState(
            { 
                arrayShopping: [..._ddata],
                i_total: summ,
                i_total_item: summ_item,
            });
      }

    _sum_item(sub_tot_new,iqty)
      {
        var _ddata=this.state.arrayShopping;   
        var initialValue = 0;
        var summ = _ddata.reduce(
            (accumulator, currentValue) => accumulator + currentValue.v_sub_tot
            ,initialValue
        );
        var summ_item = _ddata.reduce(
          (accumulator, currentValue) => accumulator + currentValue.v_qty
          ,initialValue
      );
      this.setState(
        { 
            i_total: summ+sub_tot_new,
            i_total_item: summ_item+iqty,
        });
      
      }

    ActTransaksi = () => {
        if (this.state.username ==='')
         {
             alert('Please Login First');
             return false;
         }
         
        if (parseFloat(this.state.i_total_item)==0)
        {
            alert('Belum Ada Transaksi !!!');
            return false;
        }

        Alert.alert(
              'Save',
              'Save Transaksi ?',
              [
                {
                  text: 'No',
                  onPress: () => { }
                } ,   
                {
                  text: 'Yes',
                  onPress: () => {
                    GetMaxgtid().then((gtidMax) => {
                        var gtid=1;

                        gtidMax.forEach(function(array2) {
                            if(array2.gtid.length==0)
                            {gtid=1;}
                            else
                            {gtid=parseFloat(array2.gtid)+1;}
                        });
                       
                        const NewTrans = {
                            gtid         : gtid,//Math.floor(Date.now() / 10000),
                            trans_date   : moment(new Date()).format('YYYY-MM-DD'),
                            cust_name    : (this.state.atasnama)?this.state.atasnama:'No Name',
                            cust_address : 'NO ADDR',
                            notes        : '',
                            create_time  : new Date(),
                            modify_time  : new Date(),
                            create_id    : this.state.userid,
                            modify_id    : this.state.userid,
                            user_bill    : this.state.username,
                            user_pay     : "-",
                            amount       : parseFloat(this.state.i_total),
                            tanggal      : parseFloat(moment(new Date()).format('DD')),
                            bulan        : parseFloat(moment(new Date()).format('MM')), 
                            tahun        : parseFloat(moment(new Date()).format('YYYY')),  
                            is_payed     : false, 
                           
                        };
                        this.setState({nomor_gtid:gtid});    
                        var push_data=[]; var NewItemsDetail=[];
                        var i=1;
                        this.state.arrayShopping.forEach(function(array2) {
                            NewItemsDetail = {
                                gtdid       : parseFloat(Math.floor(Date.now() / 10000))+parseFloat(i),
                                gtid        : gtid,
                                trans_date  : new Date(),
                                icode       : array2['v_code'],
                                iname       : array2['v_name'],
                                vol         : array2['v_qty'],
                                amount_price: parseFloat(array2['v_price']),
                                amount_subtotal : parseFloat(array2['v_sub_tot']),
                            };
                            i=parseFloat(i)+1;
                            push_data.push(NewItemsDetail);
                            NewItemsDetail=[];
                           });
                        insertNewTrans(NewTrans,push_data).then().catch((error) => {
                            alert(`Insert Trans :  error ${error}`);
                            });
                        
                        insertNewTrans_detail(push_data).then().catch((error) => {
                                alert(`Insert Trans Detail  :  error ${error}`);
                                });
                        Actions.TransaksiPayment({ databill: this.state.i_total, nomorinv: this.state.nomor_gtid,dataitems:push_data,atasnama:this.state.atasnama});                      
                    }).catch((error) => {
                        alert(`Insert new Trans :  error ${error}`);
                        return false;
                    }); 
                  
                    
                  },
                },
                           
              ],
              { cancelable: true }
            );

      };

    showListModal = (visible) => {
         this.setState(
            {
                modalListVisible:visible,
                searchedName:'',
            });
           
          
        }
    showModal = (visible) => {
        this.setState(
            {
                modalVisible:visible,
                i_name     : '',
                i_price    : '0',
                i_qty      : '1',
                i_hna      : '0',
            });
            
    }

    showBlockModal = (visible) => {
        this.setState(
           {
               BlockVisible:visible,
           });
          
         
       }

    showDeleteConfirmation = (index) => {
            Alert.alert(
                'Delete',
                'Are you Sure ... delete an Item ?',
                [
                    {
                        text: 'No', onPress: () => { },//Do nothing
                        style: 'cancel'
                    },
                    {
                    text: 'Yes', onPress: () => {this.deleteItems(index) }
                    },
                ],
                { cancelable: true }
            );
          
    }

    onChanged (text) {
        var xx =text.replace(/[^0-9]/g, '0');
        if (xx=='') xx=0;
        var uang=parseFloat(xx);
        this.setState({ i_price: uang});
      }
    onChanged2 (text) {
        var xx =text.replace(/[^0-9]/g, '0');
        if (xx=='') xx=0;
        var qty=parseFloat(xx);
        this.setState({ i_qty: qty});
      }  
    render() {
        return (
            <StyleProvider style={getTheme(commonColor)}>
                <Container>
                   <Content padder>
                       <ListItem noIndent style={{ height:45, backgroundColor: "#f6f6f6" }}>
                                <Left>
                                    <Item style={{borderBottomColor:"#f6f6f6"}} >
                                      <NumberFormat value={this.state.i_total} displayType={'text'} thousandSeparator={true} renderText={value => <Text style={{fontSize:20,fontStyle:'italic',fontWeight: 'bold',color:'#462749'}}>Rp. {value}</Text>}/>   
                                    </Item>
                                </Left>
                                <Right>
                                        <Button iconRight transparent onPress={() => {this.showModal(true);}}>
                                            <Icon style={{ color:'#462749'}} name="arrow-circle-o-down" type="FontAwesome"/>
                                        </Button>
                                </Right>
                                <Right>
                                        <Button iconRight transparent onPress={() => {this.showListModal(true);}}>
                                            <Icon style={{ color:'#462749'}} name="add-to-list" type="Entypo"/>
                                        </Button>
                                </Right>
                                <Right>
                                        <Button iconRight transparent onPress={() => {this.showBlockModal(true);}}>
                                            <Icon style={{ color:'#462749'}} name="list-ul" type="FontAwesome"/>
                                        </Button>
                                </Right>
                        </ListItem>
        
                        <FlatList   
                            data={this.state.arrayShopping}                 
                            extraData={this.state.arrayShopping}
                            keyExtractor={(item,index) => index.toString()}
                            renderItem={({ item,index }) => 
                                   <Grid style={{marginTop:3,padding:5,backgroundColor: index % 2 == 0 ? '#f0f0f0' : '#f6f6f6'}} onPress={() => {
                                    this.showDeleteConfirmation(index);}}>
                                    <Col style={{width:'10%',textAlign:'left'}} >
                                        <Text style={styles.iconTransitem}>{item.v_name.charAt(0).toUpperCase()}</Text>
                                    </Col>
                                    <Col style={{width:'65%'}} >
                                        <Row> 
                                            <Text style={{ fontSize: 16,marginLeft:8}}>{item.v_name}</Text> 
                                        </Row>
                                        <Row> 
                                            <Text style={{ marginLeft:8,fontSize: 10,color:'#f15a23',fontStyle:'italic'}} note>Qty: {item.v_qty}</Text> 
                                        </Row>
                                    </Col>
                                    <Col style={{width:'25%'}}>
                                        <Row style={{textAlign:'right',justifyContent:'flex-end'}}> 
                                            <NumberFormat value={item.v_sub_tot} displayType={'text'} thousandSeparator={true} renderText={value => <Text style={{marginRight:5}}>{value}</Text>}/>
                                        </Row>
                                        <Row style={{textAlign:'right',justifyContent:'flex-end'}}> 
                                            <NumberFormat value={item.v_price} displayType={'text'} thousandSeparator={true} renderText={value => <Text style={{marginRight:5,fontSize:10,fontStyle:'italic'}} numberOfLines={1}>@ {value}</Text>}/>   
                                        </Row>
                                    </Col>
                                </Grid>
                            }
                        />

                        <Card style={{flex: 1}}>
                            <CardItem cardBody>
                                <Grid style={{marginLeft:10,marginRight:5,marginTop:10}} >
                                <Row style={{marginBottom:5}}>
                                        <Col style={{width:'35%'}}><Text style={{color:'#462749',fontSize:16}}>Total Item</Text></Col>
                                        <Col style={{width:'3%'}}><Text style={{color:'#462749',fontSize:16}}>:</Text></Col>
                                        <Col>  
                                            <Text style={{ color:'#462749',fontStyle:"italic",fontWeight:"bold" }}>{this.state.i_total_item}</Text>
                                        </Col>
                                </Row>
                                <Row style={{marginBottom:5}}>
                                        <Col style={{width:'35%'}}><Text style={{color:'#462749'}}>Customer Name</Text></Col>
                                        <Col style={{width:'3%'}}><Text style={{color:'#462749',fontSize:16}}>:</Text></Col>
                                        <Col>  
                                            <Item regular style = {{height:35}}>
                                                <Input value={this.state.atasnama} onChangeText={(atasnama) => this.setState({atasnama:atasnama})}/>
                                            </Item>
                                        </Col>
                                    </Row>
                                </Grid>
                            </CardItem>
                        </Card>
                        <Button style={{marginTop:10}} block onPress={() => this.ActTransaksi()}>
                            <Text style={{ color:'#ffffff' }} >Save Bill </Text>
                        </Button>
                        
                      
                        <View style={{width:'90%'}}>
                            <Dialog
                                onDismiss={() => {this.setState({ modalVisible: false });}}
                                width={0.9}
                                visible={this.state.modalVisible}
                                rounded
                                actionsBordered
                                dialogTitle={
                                    <DialogTitle
                                        title="Add Item"
                                        style={{backgroundColor: '#F7F7F8'}}
                                        hasTitleBar={false}
                                        align="left"
                                    />
                                }
                                footer={
                                        <DialogFooter>
                                                <DialogButton
                                                    text="CANCEL"
                                                    bordered
                                                    onPress={() => {this.setState({ modalVisible: false });}}
                                                    key="button-1X"
                                                />
                                                <DialogButton
                                                    text="INSERT"
                                                    bordered
                                                    onPress={() => {this.joinData();}}
                                                    key="button-2X"
                                                />
                                        </DialogFooter>
                                    }
                            >
                            <DialogContent style={{ backgroundColor: '#F7F7F8'}}>
                                    <Form >
                                    { this.state.isHidden ? null : <Item regular style={{ marginBottom:5}}>
                                                <Input style={{height:40,fontStyle:"italic"}} 
                                                    onChangeText={i_hna => this.setState({ i_hna: i_hna })}
                                                    value={this.state.i_hna}
                                                />
                                            </Item> }

                                            <Item regular style={{ marginBottom:5}}>
                                                <Input style={{height:40,fontStyle:"italic"}}  placeholder="Item Code" autoCorrect={false}
                                                    onChangeText={i_code => this.setState({ i_code: i_code })}
                                                    value={this.state.i_code}
                                                />
                                            </Item>

                                            <Item regular style={{ marginBottom:5}}>
                                                <Input  style={{height:40,fontStyle:"italic"}}  placeholder="Item Name" autoCorrect={false}
                                                    onChangeText={data => this.setState({ i_name: data })}
                                                    value={this.state.i_name}
                                                    autoFocus = {this.state.isfocus}
                                                />
                                            </Item>
                                           
                                            <Item regular style={{ marginBottom:5}}>
                                                <Input style={{height:40}} placeholder="Price"
                                                    keyboardType='numeric' 
                                                    onChangeText={data_price => this.onChanged(data_price)}
                                                    value={this.state.i_price.toString()}
                                                    autoFocus = {this.state.isfocus}
                                                    maxLength={10} 
                                                />
                                            </Item>
                                            <Item regular >
                                                <Input style={{height:40}} placeholder="Qty"
                                                    keyboardType='numeric' 
                                                    onChangeText={data_qty => this.onChanged2(data_qty)}
                                                    value={this.state.i_qty.toString()}
                                                    maxLength={10} 
                                                />
                                            </Item>
                                    </Form>
                            </DialogContent>
                            </Dialog>
                        </View>

                        <View style={{width:'90%'}}>
                           <Dialog
                            onDismiss={() => { this.setState({ modalListVisible: false });}}
                            width={1}
                            visible={this.state.modalListVisible}
                            rounded
                            actionsBordered
                            dialogTitle={
                                <DialogTitle
                                    title="List Data Item"
                                    style={{backgroundColor: '#F7F7F8'}}
                                    hasTitleBar={false}
                                    align="left"
                                />
                            }
                            onTouchOutside={() => { this.setState({ modalListVisible: false });}}
                           
                            >
                            <DialogContent style={{backgroundColor: '#F7F7F8'}}>
                                 <ListItem noIndent style={{ backgroundColor: "#f6f6f6" }}>
                                        <Left>
                                            <Item>
                                                <Icon  style = {styles.text_menu} name='search' />
                                                <Input placeholder="Enter text to search" autoCorrect={false}
                                                    onChangeText={(text) => {
                                                        this.setState({ searchedName: text });
                                                        filterItemLists(text).then(filteredItemLists => {
                                                            this.setState({ ItemsLists: filteredItemLists });
                                                            }).catch(error => {
                                                            this.setState({ ItemsLists: [] });
                                                            });
                                                        }} 
                                                    value={this.state.searchedName}
                                                />
                                            </Item>
                                        </Left>
                                      
                                    </ListItem>
                  
                                    <FlatList                    
                                      data={this.state.ItemsLists}
                                      renderItem={({ item, index }) => <FlatListItem iid={item.iid} iname={item.iname} price={item.price} icode={item.icode} modify_time={item.modify_time} itemIndex={index}
                                      onPressItem={() => {this.joinToDialog(item);}} />}
                                      keyExtractor={item => item.icode}
                                  />
                                   <Button style={{marginTop:10,backgroundColor:'#f15a23'}} block onPress={() =>this.setState({ modalListVisible: false })}>
                                        <Text style={{ color:'#ffffff' }} >CLOSE </Text>
                                    </Button>
                            </DialogContent>
                            </Dialog>
                        </View>

                        <View style={{width:'90%'}}>
                           <Dialog
                            onDismiss={() => { this.setState({ BlockVisible: false });}}
                            width={1}
                            visible={this.state.BlockVisible}
                            rounded
                            actionsBordered
                            dialogTitle={
                                <DialogTitle
                                    title="List Data"
                                    style={{backgroundColor: '#F7F7F8'}}
                                    hasTitleBar={false}
                                    align="left"
                                />
                            }
                            onTouchOutside={() => { this.setState({ BlockVisible: false });}}
                           
                            >
                            <DialogContent style={{backgroundColor: '#F7F7F8'}}>
                            <FlatList   
                            data={this.state.BlockItems}                 
                            keyExtractor={(item,index) => index.toString()}
                            renderItem={({ item,index }) => 
                                   <Grid style={{marginTop:3,padding:5,backgroundColor: index % 2 == 0 ? '#f0f0f0' : '#f6f6f6'}} onPress={() => {
                                    this.joinToDialog(item);}}>
                                    <Col style={{width:'10%',textAlign:'left'}} >
                                        <Text style={styles.iconTransitem}>{item.iname.charAt(0).toUpperCase()}</Text>
                                    </Col>
                                    <Col style={{width:'65%'}} >
                                        <Row> 
                                            <Text style={{ fontSize: 16,marginLeft:8}}>{item.iname}</Text> 
                                        </Row>
                                        <Row> 
                                            <Text style={{ marginLeft:8,fontSize: 10,color:'#f15a23',fontStyle:'italic'}} note>Code: {item.icode}</Text> 
                                        </Row>
                                    </Col>
                                    <Col style={{width:'25%'}}>
                                        <Row style={{textAlign:'right',justifyContent:'flex-end'}}> 
                                            <NumberFormat value={item.price} displayType={'text'} thousandSeparator={true} renderText={value => <Text style={{marginRight:5}}>{value}</Text>}/>
                                        </Row>
                                       
                                    </Col>
                                </Grid>
                            }
                        />
                                   <Button style={{marginTop:10,backgroundColor:'#f15a23'}} block onPress={() =>this.setState({ BlockVisible: false })}>
                                        <Text style={{ color:'#ffffff' }} >CLOSE </Text>
                                    </Button>
                            </DialogContent>
                            </Dialog>
                        </View>

                </Content>
            </Container>
            </StyleProvider>
     
        );
      }
    }
