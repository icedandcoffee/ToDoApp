import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    ListView
} from 'react-native';

import Note from './note';

import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDLWJTw3eQHDDFEN9MwK9n7ejOcMo7RqHQ",
  authDomain: "todoapp-fcd44.firebaseapp.com",
  databaseURL: "https://todoapp-fcd44.firebaseio.com",
  storageBucket: "",
  messagingSenderId: "260427697515",
  projectId: "todoapp-fcd44"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class Main extends Component {

    constructor(props){
        super(props);
        // Initialize a reference to my firebase Database
        this.itemsRef = firebaseApp.database().ref();
        this.state = {
            noteArray: [],
            noteText: '',
            dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    }),
        };
    }

    listenForItems(itemsRef) {
        // Getting a DataSnapshot and processing it
        itemsRef.on('value', (snap) => {
          // get children as an array
          var items = [];
          // Iterate through all children of snap
          // Add the children to the array
          //  the value title is an object itself
          // and contains a key:key and a title:title
          snap.forEach((child) => {
            items.push({
              note: child.val().note,
              date: child.val().date,
              _key: child.key
            });
          });

          // NOW: Datasource is an array.
          // Each object contains title and key.
          // Update the live-synched noteArray
          this.setState({
            noteArray: items
          });

        });
      }

    componentDidMount() {
      this.listenForItems(this.itemsRef);
    }

    render() {
        let notes = this.state.noteArray.map((val, key)=>{
          console.log("keys mofo");
          console.log(val);
            return <Note key={key} keyval={key} val={val}
                    deleteMethod={()=>this.deleteNote(val._key)}/>
        });
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>- NOTER FIREBASE -</Text>
                </View>
                <ScrollView style={styles.scrollContainer}>
                    {notes}
                </ScrollView>

                <View style={styles.footer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder='Send me a new note :)'
                        onChangeText={(noteText)=> this.setState({noteText})}
                        value={this.state.noteText}
                        placeholderTextColor='white'
                        underlineColorAndroid='transparent'>
                    </TextInput>
                </View>
                <TouchableOpacity onPress={ this.addNote.bind(this) } style={styles.addButton}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
        );
    }

    addNote(){

        if(this.state.noteText){
            var d = new Date();
            this.state.noteArray.push({
                'date':d.getFullYear()+
                "/"+(d.getMonth()+1) +
                "/"+ d.getDate(),
                'note': this.state.noteText
            });

            //this.setState({ noteArray: this.state.noteArray });
            this.itemsRef.push({
                'date':d.getFullYear()+
                "/"+(d.getMonth()+1) +
                "/"+ d.getDate(),
                'note': this.state.noteText
            });
            this.setState({noteText:''});
        }
    }

    //Splice function takes parameters index, how many (elements to be removed)
    // and optionally the elements to be added
    deleteNote(key){
        console.log("Removing following child:");
        console.log(this.itemsRef.child(key));
        console.log("Key is:");
        console.log(key);
        this.itemsRef.child(key).remove();
        this.state.noteArray.splice(key, 1);
        this.setState({noteArray: this.state.noteArray});
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: '#458B00',
        alignItems: 'center',
        justifyContent:'center',
        borderBottomWidth: 10,
        borderBottomColor: '#ddd'
    },
    headerText: {
        color: 'white',
        fontSize: 18,
        padding: 26
    },
    scrollContainer: {
        flex: 1,
        marginBottom: 100
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10
    },
    textInput: {
        alignSelf: 'stretch',
        color: '#fff',
        padding: 20,
        backgroundColor: '#847f7f',
        borderTopWidth:2,
        borderTopColor: '#ededed'
    },
    addButton: {
        position: 'absolute',
        zIndex: 11,
        right: 20,
        bottom: 90,
        backgroundColor: '#66CD00',
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8
    },
    addButtonText: {
        color: '#fff',
        fontSize: 24
    }
});
