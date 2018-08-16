import React from 'react';
import { View, ScrollView, TouchableOpacity, TouchableHighlight, StyleSheet, Dimensions, Text, TextInput, Picker, Button, Alert } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import firebase from 'firebase';

import ScreenList from './screens/List';
import ScreenEdit1 from './screens/Edit1';
import ScreenEdit2 from './screens/Edit2';
import ScreenChart from './screens/Chart';

const firebaseSecrets = require('../firebaseSecrets.json');


const SCREEN_WIDTH = Dimensions.get("window").width;

firebase.initializeApp(firebaseSecrets);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// workaround of firebase issue with react 'Setting a timer for a long period of time...'
// https://github.com/firebase/firebase-js-sdk/issues/97
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings(['Setting a timer']);
const console_warn = console.warn;
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    console_warn(message);
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




function formatDateFirebase(date) {
  return date.getFullYear() + '-' + (date.getMonth() + 1 <= 9 ? '0' : '') + (date.getMonth() + 1) + '-' + (date.getDate() <= 9 ? '0' : '') + date.getDate();
}


const StackNavigator = createStackNavigator({
  ScreenList: { screen: ScreenList },
  ScreenEdit1: { screen: ScreenEdit1 },
  ScreenEdit2: { screen: ScreenEdit2 },
  ScreenChart: { screen: ScreenChart },
});


export default class App extends React.Component {
  constructor(props) {
    super(props)
    let currentDay = new Date();
    currentDay.setSeconds(0);
    currentDay.setMilliseconds(0);
    this.state = { loading: true, currentDay: currentDay, selectedRow: -1, list: [] }
    this.onSave = this.onSave.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onLoadDay = this.onLoadDay.bind(this);
    this.onSelectRow = this.onSelectRow.bind(this);
  }

  componentDidMount() {
    this.onLoadDay(0);
  }

  onRemove(key) {
    console.log("remove " + key);
    let pr = firebase.database().ref('feeds/' + formatDateFirebase(this.state.currentDay)).child(key).remove();
    return pr.then(() => this.onLoadDay(0));
  }
  onSave(obj) {
    let pr;
    let firebaseRef = firebase.database().ref('feeds/' + formatDateFirebase(this.state.currentDay));
    let objCopy = { ...obj };
    objCopy.date = obj.date.toISOString();
    if (objCopy.key) {
      delete objCopy.key;
      console.log("update " + obj.key, formatDateFirebase(this.state.currentDay));
      pr = firebaseRef.child(obj.key).set(objCopy);
    } else {
      console.log("add");
      pr = firebaseRef.push(objCopy);
    }
    return pr.then(() => this.onLoadDay(0));
  }

  onSelectRow(i) {
    if (i >= 0 && i < this.state.list.length) {
      if (this.state.selectedRow === i)
        this.setState({ selectedRow: -1 });
      else
        this.setState({ selectedRow: i });
    } else {
        this.setState({ selectedRow: -1 });      
    }
  }

  onLoadDay(step) {
    let currentDay = new Date(this.state.currentDay.getTime() + 24 * 3600 * 1000 * step);
    this.setState({ loading: true, currentDay: currentDay, list:[] });
    return firebase.database().ref('feeds/' + formatDateFirebase(currentDay)).once('value').then((snapshot) => {
      let list = [];
      snapshot.forEach((cs) => {
        let obj = cs.val();
        obj.key = cs.key;
        obj.date = new Date(obj.date);
        list.push(obj);
      });
      list.sort((a, b) => b.date.getTime() - a.date.getTime());
      this.setState({ loading: false, currentDay: currentDay, list: list });
    });
  }

  onLoadDays(count) {
    return firebase.database().ref('feeds').orderByKey().limitToLast(count).once('value').then((snapshot) => {
      let list = [];
      snapshot.forEach((cs) => {
        let charItem = {date:cs.key, feeds:[]}
        if(cs.val() instanceof Array) {
          cs.val().forEach((v)=> {
            if(v) {
              charItem.feeds.push(v);
            }
          })
        } else {
          let obj = cs.val();
          Object.keys(obj).forEach((k)=> {
            let v = obj[k];
            charItem.feeds.push(v);
         })
        }
        list.push(charItem);
      });
     
      return list;
    });
  }

  render() {
    return (<StackNavigator screenProps={{
      ...this.state,
      onSave: this.onSave,
      onRemove: this.onRemove,
      onSelectRow: this.onSelectRow,
      onLoadDay: this.onLoadDay,
      onLoadDays: this.onLoadDays
    }} />)
  }
}