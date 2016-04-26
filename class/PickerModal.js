"use strict";
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  MapView,
  Modal,
  TextInput,
  AsyncStorage,
  View
} from 'react-native';

const STORAGE_KEY = '@AsyncStorage:';
const SideMenu = require('react-native-side-menu');

export class PickerModal extends Component {

    static get instance(){
        return this._instance
    }

    static set instance(val){
        this._instance = val;
    }

    constructor(){
        super();

        if(PickerModal.instance != typeof(PickerModal)){
            PickerModal.instance = this;
            this.state =  {
              animated: true,
              modalVisible: false,
              transparent: true,
              subtext: ''
            };
            return this;
        }
        else{
            return PickerModal.instance;
        }
    }

  _setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  toggle(){
      this._setModalVisible.bind(this, false)
  }

  onAddPress(visible){
      console.log(this.state.text, this.state.subtext);
      Map.instance.addPicker(this.state.text, this.state.subtext);
      this.setState({modalVisible: visible});
  }
  render() {
    var modalBackgroundStyle = {
      backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',
    };
    var innerContainerTransparentStyle = {backgroundColor: '#fff', padding: 20}



    return (
        <Modal
          animated={this.state.animated}
          transparent={this.state.transparent}
          visible={this.state.modalVisible}>
          <View style={[styles.modalVisiblecontainer, modalBackgroundStyle]}>
            <View style={[styles.innerContainer, innerContainerTransparentStyle]}>
              <Text> point</Text>
              <Text>Titre de votre point</Text>
                    <TextInput onChangeText={(text) => this.setState({text})}
                    value={this.state.text} style={{left: 10, right: 10, height: 30, borderColor: 'gray', borderWidth: 1}} ></TextInput>
              <Text>Description de votre point</Text>
                    <TextInput onChangeText={(subtext) => this.setState({subtext})}
                    value={this.state.subtext} style={{left: 10, right: 10, height: 30, borderColor: 'gray', borderWidth: 1}} ></TextInput>


              <TouchableOpacity
                onPress={this.onAddPress.bind(this, false)}
                style={styles.modalButton}>
                <Text>Valider</Text>
              </TouchableOpacity>
                <Text>Annuler</Text>
            </View>
          </View>
        </Modal>

    );
  }
};

const styles = StyleSheet.create({
modalVisiblecontainer: {
flex: 1,
justifyContent: 'center',
padding: 20,
},
innerContainer: {
 borderRadius: 10,
 alignItems: 'center',
},
sidemenu: {
  height: 2000,
  width:2000,
  backgroundColor: '#cfd8dc',
},
});
