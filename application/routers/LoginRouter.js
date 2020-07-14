import React, { Component } from 'react';
import {Router, Stack, Scene} from 'react-native-router-flux';

import Login from '../views/LoginForm';
import Mainpage from '../routers/MainRouter';

export default class LoginRouter extends React.Component {
    render() {
        return(
            <Router>
                <Stack key="root" hideNavBar>
                    <Scene initial key="login" component={Login} title="Login" />
                    <Scene key="Mainpage" component={Mainpage} title="MainPage"/>
                </Stack>
            </Router>
        )
    }
}