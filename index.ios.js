/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
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
const PickerModal = require('./class/PickerModal.js').PickerModal;
var categorie = [];
var categorieencours;

AppRegistry.registerComponent('PickerModal', () => PickerModal);

class CategorieModal extends Component {

    static get instance(){
        return this._instance
    }

    static set instance(val){
        this._instance = val;
    }

    constructor(){
        super();
        if(CategorieModal.instance != typeof(CategorieModal)){
            CategorieModal.instance = this;
            this.state =  {
              animated: true,
              modalVisible: false,
              transparent: true,
              text: ""
            };
            return this;
        }
        else{
            return CategorieModal.instance;
        }
    }


  _setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  onAddPress(){
      Categorie.save(this.state.text)
      this.setState({modalVisible: false});

  }

  toggle(){
      this._setModalVisible.bind(this, false)
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

            <Text>Titre de votre Catégorie</Text>
                  <TextInput onChangeText={(text) => this.setState({text})}
                  value={this.state.text} style={{left: 10, right: 10, height: 30, borderColor: 'gray', borderWidth: 1}} ></TextInput>
              <TouchableOpacity
                onPress={this.onAddPress.bind(this, false)}
                style={styles.modalButton}>
                <Text>Valider</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

    );
  }
};

AppRegistry.registerComponent('CategorieModal', () => CategorieModal);

class Categorie extends Component{
    render(){
        return(
            <View >
                <Text onPress={() => this.categorie(this.props.idcategorie)} style={styles.paddingMenuItem}>{this.props.text}</Text>
                <View style={styles.line}></View>
            </View>
        )
    }
    categorie(idcategorie){
        categorieencours = idcategorie;
        Picker.load(idcategorie);
    }

    static async save(nom) {
        var newid = categorie.length
        try {
            var obj = { nom : nom, id : newid};
            categorie.push(obj);
            console.log(categorie);
            await AsyncStorage.setItem(STORAGE_KEY + "categories", JSON.stringify(categorie));
            console.log('Saved selection to disk: ' + Map.markers);
            Categorie.load();
        }
        catch (error) {
            console.log('AsyncStorage error: ' + error.message);
        }
    }

    static async load() {
        try {
            categorie = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY + "categories"));
            categorieencours = categorie[0].id;

            //Categorie.save("Champignons", 2)
        }
        catch (error){
            console.log('AsyncStorage error: ' + error.message);
        }

    }

    static async deleteAll(){
        try {
            await AsyncStorage.removeItem(STORAGE_KEY + "categories");
            console.log("ok")
        } catch (error) {
            console.log(error)
        }
    }

}

Categorie.load()

//Categorie.deleteAll();

//console.log("---------------")
//var cate = Categorie.load()


AppRegistry.registerComponent('Categorie', () => Categorie );

class Menu extends Component {

    OnPress(){
        CategorieModal.instance._setModalVisible()
    }
  render() {
      this.rows = [];
      if(categorie == null){
          categorie = [];
      }
    return (
      <View style={styles.sidemenu}>
          <View style={styles.topbars}></View>
          <View>{categorie.map(function(element) {
           return <Categorie key={element.id} idcategorie={element.id} text={element.nom} />;
        })}</View>
        <View style={styles.plusCate}>
        <TouchableOpacity onPress={this.OnPress}>
            <Text style={styles.plusCateText}>+</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
};

class Picker {

    static async save(categorie) {
        try {
            console.log(categorie)
            await AsyncStorage.setItem(STORAGE_KEY + categorie + ":picker", JSON.stringify(Map.markers));
            console.log('Saved selection to disk: ' + Map.markers);
        }
        catch (error) {
            console.log('AsyncStorage error: ' + error.message);
        }
    }

    static async load(categorie) {
        try {
            console.log(categorie)
            Map.markers = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY + categorie + ":picker"));
            if(Map.markers === null){
                Map.markers = [];
            }
            Map.instance.forceUpdate()
        }
        catch (error){
            console.log('AsyncStorage error: ' + error.message);
        }
    }
    static async deleteAll(categorie){
        try {
            await AsyncStorage.removeItem(STORAGE_KEY + categorie + ":picker");
            this._appendMessage('Selection removed from disk.');
        } catch (error) {
            this._appendMessage('AsyncStorage error: ' + error.message);
        }
    }

}

class Map extends Component{

    static get markers(){
        return this.marker;
    }

    static set markers(val){
        this.marker = val;
    }

    static get instance(){
        return this._instance
    }

    static set instance(val){
        this._instance = val;
    }

    constructor(){
        super();
        if(Map.instance != typeof(Map)){
            Picker.load(categorieencours)
            Map.instance = this;
            return this;
        }
        else{
            return Map.instance;
        }
    }
    render() {
        return(
        <View>
            <MapView
                style={styles.map}
                region={regions}
                annotations={Map.markers}
            />
        </View>
        );
    }

    addPicker(title, subtitle){
        console.log("Enter on AddPicker")
        navigator.geolocation.getCurrentPosition(
          (position) => {
              Map.markers.push({
                  latitude : position.coords.latitude,
                  longitude : position.coords.longitude,
                  title : title,
                  subtitle : subtitle
              });
               this.forceUpdate();
               Picker.save(categorieencours);
          });
    }

};

AppRegistry.registerComponent('Map', () => Map );

class Spotter2 extends Component {

    state = {
      isOpen: false,
    };

    closeMenu() {
      this.setState({ isOpen: false });
    }

    toggleMenu() {
      this.setState({ isOpen: !this.state.isOpen });
    }

    OnPress(){
        PickerModal.instance._setModalVisible()
    }

    Delete(){
        Picker.deleteAll();
    }

    render() {
        this.menu = <Menu navigator={navigator} />;
        return (
        <SideMenu
            isOpen={this.state.isOpen}
            menu={this.menu}
            onContentPress={() => this.closeMenu()}>
            <View>
            <CategorieModal></CategorieModal>
            <PickerModal></PickerModal>
                <View style={styles.topbar}></View>
                <View style={styles.menu}>
                    <TouchableOpacity onPress={() => this.toggleMenu()}>
                        <Image style={styles.burger} source={require('./img/menu.png')} />
                    </TouchableOpacity>
                <View style={styles.container}>
                    <Text style={styles.title}>Spotter</Text>
                </View>
                        <Image style={styles.logo} source={require('./img/logo.png')}/>
                </View>
                <Map/>

                <View style={styles.plus}>
                <TouchableOpacity onPress={this.OnPress}>
                    <Text style={styles.plusText}>+</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </SideMenu>

        );
    };
}

//Picker.deleteAll(2);

var regions = {
    latitude: 47.2171455,
    longitude: -1.5540445000000318,
    latitudeDelta:2,
    longitudeDelta:2,

};

const styles = StyleSheet.create({
    plus: {position: 'absolute', shadowColor: 'black', shadowOffset: {height : 2, width : 1},shadowOpacity: 0.8, borderRadius: 60, left : 230, top : 480, backgroundColor: '#00bcd4', height:60, width:60
},

plusCate: {position: 'absolute', shadowColor: 'black', shadowOffset: {height : 2, width : 1},shadowOpacity: 0.8, borderRadius: 60, left : 150, top : 500, backgroundColor: '#00bcd4', height:50, width:50
},

    plusText:{
        top:4,
        left:19,
        fontSize:40,
        backgroundColor: "transparent",
        color:"white",
        fontWeight:"300"

    },

    plusCateText:{
        top:-1,
        left:14,
        fontSize:40,
        backgroundColor: "transparent",
        color:"white",
        fontWeight:"300"

    },

    line:{
        height:1,
        width:180,
        left:20,
        backgroundColor: "#565656",
    },
   map: {
      height: 490,
    },

  topbars: {
      height: 20,
      backgroundColor: '#607d8b',
    },

  topbar: {
    height: 20,
    backgroundColor: '#455a64',
    },

  add: {
    backgroundColor: '#455a64',
   },

  menu: {
    height: 60,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#607d8b',
  },

  burger: {
    left:20,
  },

  logo:{
     right:15,
  },

  logos:{
     right:15,
     top:470,
  },

  title: {
    fontSize: 25,
    color:'#ffffff',
    fontWeight: '200',
  },

  container: {
      left:150,
      flex:1,
  },

  sidemenu: {
    height: 2000,
    width:2000,
    backgroundColor: '#cfd8dc',
  },
  paddingMenuItem: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    fontSize:16,
  },
  modalVisiblecontainer: {
  flex: 1,
  justifyContent: 'center',
  padding: 20,
},
innerContainer: {
   borderRadius: 10,
   alignItems: 'center',
 },
});


AppRegistry.registerComponent('Spotter2', () => Spotter2);
