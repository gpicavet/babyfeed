import React from 'react';
import { View, ScrollView, TouchableOpacity, TouchableHighlight, StyleSheet, Dimensions, Text, TextInput, Picker, Button, Alert } from 'react-native';

const SCREEN_WIDTH = Dimensions.get("window").width;

export default class ScreenEdit2 extends React.Component {
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
          placeholder="commentaire"
          style={{ textAlignVertical: "top", height:'50%' }}
          multiline={true}
          onChangeText={(text) => this.setState({ comment: text })}
          value={this.state.comment}
        />

        <Button
          title="Ajouter"
          onPress={() => {
            return this.props.screenProps.onSave(this.state)
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