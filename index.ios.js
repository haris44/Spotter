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
  AsyncStorage,
  View
} from 'react-native';

const STORAGE_KEY = '@AsyncStorage:';
const SideMenu = require('react-native-side-menu');
var categorie = [];
var categorieencours;

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

    static async save(nom, id) {

        try {
            var obj = { nom : nom, id : id };
            categorie.push(obj);
            console.log(categorie);
            await AsyncStorage.setItem(STORAGE_KEY + "categories", JSON.stringify(categorie));
            console.log('Saved selection to disk: ' + Map.markers);
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
            //Picker.deleteAll(1);
            //Picker.deleteAll(2)
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

    onPressButton(){
        console.log(categorieencours[0])
        navigator.geolocation.getCurrentPosition(
          (position) => {
              Map.markers.push({
                  latitude : position.coords.latitude,
                  longitude : position.coords.longitude,
                  title : 'test',
                  subtitle : 'test'
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
        Map.instance.onPressButton();
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
                <View style={styles.topbar}></View>
                <View style={styles.menu}>
                    <TouchableOpacity onPress={() => this.toggleMenu()}>
                        <Image style={styles.burger} source={require('./img/menu.png')} />
                    </TouchableOpacity>
                <View style={styles.container}>
                    <Text style={styles.title}>Spotter</Text>
                </View>
                    <TouchableOpacity onPress={this.OnPress}>
                        <Image style={styles.logo} source={require('./img/logo.png')}/>
                    </TouchableOpacity>
                </View>
                <Map/>
        </SideMenu>
        );
    };
}

var regions = {
    latitude: 47.2171455,
    longitude: -1.5540445000000318,
    latitudeDelta:2,
    longitudeDelta:2,

};

const styles = StyleSheet.create({

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

  plus: {
    fontSize: 25,
    color:'#ffffff',
    fontWeight: '200',
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
});


AppRegistry.registerComponent('Spotter2', () => Spotter2);
