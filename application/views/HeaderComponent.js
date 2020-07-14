/*
============================================
Mr Nguyen Duc Hoang
https://www.youtube.com/c/nguyenduchoang
Email: sunlight4d@gmail.com
HeaderComponent = "Header" of all screens
============================================

=============================================
*/
import React, { Component } from 'react';
import {StyleSheet, View, Text, TouchableOpacity,Platform, Image, Alert} from "react-native";
//sort 
import { SORT_ASCENDING } from './sortStates';
import { Icon,Button} from 'native-base';

const HeaderComponent = props => {
    const { hasSortButton, sort, sortState} = props;
    var sortIcon = sortState === SORT_ASCENDING ?
        <Icon name='sort-desc' type='FontAwesome' style={{ color:'#9ac9df'}}/> :
        <Icon name='sort-asc' type='FontAwesome' style={{ color:'#9ac9df'}}/>;
    return (
        <View >
            {hasSortButton && <Button iconLeft transparent onPress={sort}>
                {sortIcon}
            </Button>}
       </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgb(224, 93, 144)',
        height: Platform.OS === 'ios' ? 100 : 80,
    },
    titleText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        position: 'absolute',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        padding: 50
    },
    addButton: {
        zIndex: 2,
        marginRight: 10,
        marginTop: 30,
    },
    addButtonImage: {
        width: 42,
        height: 42,
        tintColor: 'white'
    },
    deleteButtonImage: {
        width: 26,
        height: 26,
        tintColor: 'white'
    },
    sortButtonImage: {
        width: 26,
        height: 26,    
        tintColor: 'white'    
    }
});
export default HeaderComponent;