import React from 'react';
import { View, ScrollView, TouchableOpacity, TouchableHighlight, StyleSheet, Dimensions, Text, TextInput, Picker, Button, Alert } from 'react-native';

const SCREEN_WIDTH = Dimensions.get("window").width;

export default class ScreenFirebaseConfig extends React.Component {
  static navigationOptions = {
    title: 'Edit 2/2',
  };
  constructor(props) {
    super(props)
    this.state = { ...this.props.navigation.state.params }
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>

        <TextInput
          placeholder="put json config here"
          style={{ textAlignVertical: "top", height:'50%' }}
          multiline={true}
          onChangeText={(text) => this.setState({ config: text })}
          value={this.state.config}
        />

        <Button
          title="OK"
          onPress={() => {
            return this.props.screenProps.onSaveFirebaseConfig(this.state)
              .then(
                () => navigate('ScreenList'));
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