import React, { Component } from 'react';
import { Router, Scene,Drawer,Stack} from 'react-native-router-flux';
import { Icon,Button } from 'native-base';
import SideMenu from '../views/Menu';
import Home from '../views/Home';
import ItemsList from '../views/ItemsList';
import Items from '../views/ItemsForm';
import RegAlert from '../views/RegAlert';

import TransaksiAdd from '../views/TransaksiAdd';
import TransaksiList from '../views/TransaksiList';
import TransaksiRekap from '../views/TransaksiRekap';
import TransaksiPayment from '../views/TransaksiPayment';
import ImportData from '../views/ImportData';
import Profile from '../views/Profile';
import Registration from '../views/Registration';
import { Actions } from 'react-native-router-flux';
import { Col, Row, Grid } from "react-native-easy-grid";
import Sett_Print from '../views/Sett_Print';
import TransaksiPaymentDelete from '../views/TransaksiPaymentDelete';
import UserAccess from '../views/UserAccess';
import History_delete from '../views/History_delete';


const MenuIcon = () => {
return(
    <Icon name='apps' style={{color:'#f15a23'}} />
)
};
const Btr = () => {
    return(
        <Grid style={{marginRight:10}} >
             <Col  style={{marginTop:-3}}>
                <Button transparent onPress={() => Actions.Home()}>
                    <Icon name='home' style={{color:'#f15a23'}}/> 
                </Button>
            </Col>
            <Col style={{marginTop:-3}}>
                <Button transparent onPress={() => Actions.TransaksiList()}>
                    <Icon name='list' style={{color:'#f15a23'}}/> 
                </Button>
            </Col>
           
        </Grid>

    )
    };

export default class MainRouter extends React.Component {
    render() {
        return(
        <Router>
             <Stack key="rootx">
            <Drawer key="drawer"                    
                        contentComponent={SideMenu}
                        drawerIcon={MenuIcon}
                        drawerWidth={300}
                        hideNavBar
            > 
                <Scene key="root"> 
                    <Scene key="Home" title="Home" component={Home} hideNavBar initial/>
                    <Scene key="ItemsList" title="Items List" component={ItemsList} hideNavBar/>
                    <Scene key="Items" title="Items" component={Items} hideNavBar/>
                    <Scene key="TransaksiAdd" title="CASHIER" component={TransaksiAdd} renderRightButton={Btr}/>
                    <Scene key="TransaksiPayment" title="PAYMENT" component={TransaksiPayment} renderRightButton={Btr}/>
                    <Scene key="TransaksiList" title="CASHIER REPORT" component={TransaksiList} renderRightButton={Btr}/>
                    <Scene key="TransaksiRekap" title="REPORT REKAP" component={TransaksiRekap} renderRightButton={Btr}/>
                    <Scene key="ImportData" title="Import Data Items" component={ImportData} renderRightButton={Btr}/>
                    <Scene key="Profile" title="Profile" component={Profile} hideNavBar/>
                    <Scene key="Registration" title="Registration" component={Registration} hideNavBar/>
                    <Scene key="Sett_Print" title="Setting Bluetooth" component={Sett_Print} renderRightButton={Btr}/>
                    <Scene key="RegAlert" title="Reg Alert" component={RegAlert} hideNavBar/>
                    <Scene key="TransaksiPaymentDelete" title="Confirm Delete" component={TransaksiPaymentDelete} hideNavBar/>
                    <Scene key="UserAccess" title="User Access" component={UserAccess} hideNavBar/>
                    <Scene key="History_delete" title="Histroy Delete Payment" component={History_delete} renderRightButton={Btr}/>
                </Scene>
            </Drawer>
            </Stack>
        </Router>
        )
      
    }
}

/* <Router>
        <Scene key="root">
          <Scene key="pageOne" component={PageOne} title="PageOne" initial={true} />
          <Scene key="pageTwo" component={PageTwo} title="PageTwo" />
        </Scene>
      </Router> */