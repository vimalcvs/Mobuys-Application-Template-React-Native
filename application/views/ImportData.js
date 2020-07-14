import React, { Component } from 'react';
import {Container, Content,Card,CardItem,Body,Icon, StyleProvider,Button,Left} from 'native-base';
import getTheme from '../../native-base-theme/components';
import commonColor from '../../native-base-theme/variables/commonColor';
import {insertMigrasiItems} from '../models/allSchemas';
import {Alert, StyleSheet, Text} from 'react-native';
import { Actions } from 'react-native-router-flux';
import XLSX from 'xlsx';
import {readFile } from 'react-native-fs';
import RNFS from 'react-native-fs';
const DDP = RNFS.ExternalDirectoryPath +"/";
const input = res => res;

export default class ImportData extends Component {
    constructor(props) {
        super(props);
       
    }
    
  importFile () {
		Alert.alert("Migrasi Data  ", "Copy to local database", [
			{text: 'Cancel', onPress: () => {}, style: 'cancel' },
			{text: 'Import', onPress: () => {
				readFile(DDP + "items.xlsx", 'ascii').then((res) => {
					/* parse file */
					const wb = XLSX.read(input(res), {type:'binary'});

					/* convert first worksheet to AOA */
					const wsname = wb.SheetNames[0];
					const ws = wb.Sheets[wsname];
                    const data = XLSX.utils.sheet_to_json(ws, {header:1});
                    var push_data=[]; var NewItems=[];
                    data.forEach(function(array2) {
                        
                        if (array2[0]!==undefined)
                        {
                            NewItems = {
                                iid         : Math.floor(Date.now() / 10000),
                                icode       : array2[0],
                                iname       : array2[1],
                                create_time : new Date(),
                                modify_time : new Date(),
                                price       : parseFloat(array2[3]),
                                harga_beli  : parseFloat(array2[2]),
                            }
                            if (array2[0]!=='KODE') push_data.push(NewItems);
                            
                        }
                        NewItems=[];
                      });
					/* update state */
                   // this.setState({ data: data});
                   insertMigrasiItems(push_data).then().catch((error) => {
                    alert(`Migrasi Items :  error ${error}`);
                    });
                    Alert.alert(
                      'Success',
                      'Migrasi Items successfully',
                      [
                        {
                          text: 'Ok',
                          onPress: () => {Actions.ItemsList();},
                        },

                      ],
                      { cancelable: false }
                    );
                    
				}).catch((err) => { Alert.alert("importFile Error", "Error " + err.message); });
			}}
		]);
	}

  render(){
    return(
      <StyleProvider style={getTheme(commonColor)}>
      <Container>
       
        <Content padder>
        <Card>
            <CardItem>
              <Left>
                <Icon name='upload' type="Entypo" style={{color:'#462749',fontSize:36}}/> 
                <Body>
                  <Text style={{color:'#f44336'}} >Pastikan File Items.xlsx sudah berada di</Text>
                  <Text style={{fontSize:16,fontStyle:"italic",color:'#462749'}}>Android/data/com.mobuys/files/</Text>
                </Body>
              </Left>
              
            </CardItem>
          
          </Card>

          <Card style={{flex: 1}}>
          <CardItem>
              <Left>
                <Body>
                    <Button block primary onPress={() => this.importFile()} >
                        <Text style={{color:"#fff"}} >Import data from a spreadsheet</Text>
                    </Button>
                </Body>
              </Left>
            </CardItem>
           
          </Card>
         </Content>
         
      </Container>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF' },
	welcome: { fontSize: 20, textAlign: 'center', margin: 10 },
	instructions: { textAlign: 'center', color: '#333333', marginBottom: 5 },
	thead: { height: 40, backgroundColor: '#f1f8ff' },
	tr: { height: 30 },
	text: { marginLeft: 5 },
	table: { width: "100%" }
});