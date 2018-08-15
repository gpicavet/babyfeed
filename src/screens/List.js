import React from 'react';
import { View, ScrollView, TouchableOpacity, TouchableHighlight, StyleSheet, Dimensions, Text, TextInput, Picker, Button, Alert } from 'react-native';

const SCREEN_WIDTH = Dimensions.get("window").width;

function formatDateShort(date) {
  return (date.getDate() <= 9 ? '0' : '') + date.getDate() + '/' + (date.getMonth() + 1 <= 9 ? '0' : '') + (date.getMonth() + 1) + '/' + date.getFullYear();
}
function formatListTime(date) {
  return (date.getHours() <= 9 ? '0' : '') + date.getHours() + ':' + (date.getMinutes() <= 9 ? '0' : '') + (date.getMinutes());
}
function formatDateFirebase(date) {
  return date.getFullYear() + '-' + (date.getMonth() + 1 <= 9 ? '0' : '') + (date.getMonth() + 1) + '-' + (date.getDate() <= 9 ? '0' : '') + date.getDate();
}


export default class ScreenList extends React.PureComponent {
    static navigationOptions = {
      title: 'Home',
    };
  
    constructor(props) {
      super(props)
    }
  
    render() {
      const { navigate } = this.props.navigation;
      const lastDay = formatDateFirebase(this.props.screenProps.currentDay) >= formatDateFirebase(new Date());
      return (
        <View style={styles.container}>
          <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{formatDateShort(this.props.screenProps.currentDay)}</Text>
          <View key='h' style={{ alignSelf: 'stretch', flexDirection: 'row', paddingBottom: 5 }}>
            <Text style={{ flex: 1, alignSelf: 'stretch', fontWeight: 'bold' }}>Heure</Text>
            <Text style={{ flex: 1, alignSelf: 'stretch', fontWeight: 'bold' }}>sein d (min)</Text>
            <Text style={{ flex: 1, alignSelf: 'stretch', fontWeight: 'bold' }}>sein g (min)</Text>
            <Text style={{ flex: 1, alignSelf: 'stretch', fontWeight: 'bold' }}>mat(ml)</Text>
            <Text style={{ flex: 1, alignSelf: 'stretch', fontWeight: 'bold' }}>art(ml)</Text>
          </View>
  
          {this.props.screenProps.loading && <Text>CHARGEMENT...</Text>}
  
          <ScrollView style={{ flex: 1 }}>
  
            {this.props.screenProps.list.map((v, i) =>
              <TouchableOpacity key={i}
                onPress={() => this.props.screenProps.onSelectRow(i)}>
                <View style={{ flex: 1, alignSelf: 'stretch', backgroundColor: this.props.screenProps.selectedRow === i ? '#0C9' : '#eee', marginBottom: 5 }}>
                  <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', height: 25, }}>
                    <Text style={{ flex: 1, alignSelf: 'stretch', fontWeight: 'bold' }}>{formatListTime(v.date)}</Text>
                    <Text style={{ flex: 1, alignSelf: 'stretch' }}>{v.durationD}</Text>
                    <Text style={{ flex: 1, alignSelf: 'stretch' }}>{v.durationG}</Text>
                    <Text style={{ flex: 1, alignSelf: 'stretch' }}>{v.mMilk}</Text>
                    <Text style={{ flex: 1, alignSelf: 'stretch' }}>{v.aMilk}</Text>
                  </View>
                  <Text style={{ flex: 1, alignSelf: 'stretch', minHeight: 25 }}>{v.comment}</Text>
                </View>
              </TouchableOpacity  >
            )}
          </ScrollView>

          <View style={{ flexDirection: 'row' }}>
            <TouchableHighlight
              style={styles.page}
              onPress={() =>
                this.props.screenProps.onLoadDay(-1)
              }
            >
              <Text style={{ flex: 1, fontSize: 50, color: '#fff', textAlign: 'center', marginTop: -10 }}>&lt;</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={[styles.page, lastDay ? { backgroundColor: '#eee' } : {}]}
              disabled={lastDay}
              onPress={() =>
                this.props.screenProps.onLoadDay(+1)
              }
            >
              <Text style={{ flex: 1, fontSize: 50, color: '#fff', textAlign: 'center', marginTop: -10 }}>&gt;</Text>
            </TouchableHighlight>
          </View>

          {this.props.screenProps.selectedRow >= 0 &&
            <TouchableHighlight style={[styles.float, { bottom: 10 + 1 * (60 + 5) }]} onPress={() => {
                this.props.screenProps.onSelectRow(-1);
                return navigate('ScreenEdit1', this.props.screenProps.list[this.props.screenProps.selectedRow]);
              }}>
              <Text style={{ flex: 1, fontSize: 50, color: '#fff', textAlign: 'center', marginTop: -15 }}>...</Text>
            </TouchableHighlight>
          }

          {this.props.screenProps.selectedRow >= 0 &&
            <TouchableHighlight style={[styles.float, { bottom: 10 + 0 * (60 + 5) }]} onPress={() => {
  
                return Alert.alert(
                  'Confirmation',
                  'Confirme la suppression',
                  [
                    {text: 'Annuler', style: 'cancel'},
                    {text: 'OK', onPress: () => this.props.screenProps.onRemove(this.props.screenProps.list[this.props.screenProps.selectedRow].key)
                                                  .then(()=> this.props.screenProps.onSelectRow(-1))},
                  ],
                  { cancelable: true }
                );
              }
              }>
              <Text style={{ flex: 1, fontSize: 50, color: '#fff', textAlign: 'center', marginTop: -5 }}>X</Text>
            </TouchableHighlight>
          }

          {this.props.screenProps.selectedRow < 0 &&
            <TouchableHighlight style={styles.float} onPress={() =>
              navigate('ScreenEdit1')}>
              <Text style={{ flex: 1, fontSize: 50, color: '#fff', textAlign: 'center', marginTop: -5 }}>+</Text>
            </TouchableHighlight>
          }
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      width: SCREEN_WIDTH,
      height: '100%',
      padding: 20
    },
    page: {
      width: 50,
      height: 50,
      backgroundColor: '#0C9',
      borderRadius: 25,
      shadowColor: "#999",
      shadowRadius: 3,
      shadowOffset: {
        height: 2,
        width: 2
      }
    },
    float: {
      position: 'absolute',
      width: 60,
      height: 60,
      bottom: 10,
      right: 10,
      backgroundColor: '#0C9',
      borderRadius: 30,
      shadowColor: "#999",
      shadowRadius: 3,
      shadowOffset: {
        height: 2,
        width: 2
      }
    }
  });