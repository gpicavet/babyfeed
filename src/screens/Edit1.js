import React from 'react';
import { View, ScrollView, TouchableOpacity, TouchableHighlight, StyleSheet, Dimensions, Text, TextInput, Picker, Button, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';

const SCREEN_WIDTH = Dimensions.get("window").width;

function parseTime(dateString) {
    const [, hours, minutes] = /(\d{2}):(\d{2})/.exec(dateString);
    let d = new Date();
    d.setHours(hours, minutes);
    return d;
  }

class SelectInt extends React.PureComponent {
    render() {
        return (<View style={{ flex: 1, flexDirection: 'column' }}>
              <Text style={{ fontSize: 20 }}>
                {this.props.label}
              </Text>
  
              <Picker
                style={{ flex: 1}}
                selectedValue={this.props.selectedValue}
                onValueChange={(value, index) => this.props.onValueChange(parseInt(value))}>
                {Array.from(Array(this.props.count).keys()).map((v, i) =>
                  <Picker.Item key={i} label={(this.props.step * v).toString()} value={(this.props.step * v).toString()} />)
                }
              </Picker>
            </View>);       
    }
}


export default class ScreenEdit1 extends React.Component {
    static navigationOptions = {
      title: 'Edit 1/2',
    };
    constructor(props) {
      super(props)
      if (this.props.navigation.state.params)
        this.state = { ...this.props.navigation.state.params }
      else
        this.state = { date: this.props.screenProps.currentDay, durationD: 0, durationG: 0, aMilk: 0, mMilk: 0, comment:'' }
    }
    render() {
      const { navigate } = this.props.navigation;
      return (
        <View style={styles.container}>
  
          <Text style={{ fontSize: 20 }}>
            Heure
          </Text>
          <DatePicker
            style={{ flex: 1, width: SCREEN_WIDTH * 0.8, padding: 5 }}
            mode='time'
            format='HH:mm'
            cancelBtnText='Annuler' //force french because of ios chinese default
            confirmBtnText='OK'
            date={this.state.date}
            onDateChange={(date) => { this.setState({ date: parseTime(date) }) }}
          />
  
          <View style={{ flex: 1, flexDirection: 'row', padding: 5 }}>
            <SelectInt
                label='sein D (min)'
                selectedValue={this.state.durationD.toString()}
                onValueChange={itemValue => this.setState({ durationD: itemValue })}
                count={20}
                step={5}
            />
            <SelectInt
                label='sein G (min)'
                selectedValue={this.state.durationG.toString()}
                onValueChange={itemValue => this.setState({ durationG: itemValue })}
                count={20}
                step={5}
            />

          </View>
  
          <View style={{ flex: 1, flexDirection: 'row', padding: 5 }}>
            <SelectInt
                label='bib lait mat. (ml)'
                selectedValue={this.state.mMilk.toString()}
                onValueChange={itemValue => this.setState({ mMilk: itemValue })}
                count={70}
                step={5}
            />
            <SelectInt
                label='bib lait art. (ml)'
                selectedValue={this.state.aMilk.toString()}
                onValueChange={itemValue => this.setState({ aMilk: itemValue })}
                count={70}
                step={5}
            />
          </View>
  
          <Button
            title="Suivant"
            onPress={() => {
              return  navigate('ScreenEdit2', this.state);
            }
            }
          />
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
    }
  });