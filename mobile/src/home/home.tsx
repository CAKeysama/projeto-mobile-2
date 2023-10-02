import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import AnimalService from '../services/servicoAnimal'
import Icon from 'react-native-vector-icons/Ionicons';
import { Animal } from '../models/animal'
export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.findAllAnimal()        
    }

    state = {
        data: [],
        value: null,
        onChangeText: null,
        dataId: null,
        dataInsert:null
    }

    //acionado quando o componente e montado
    componentDidMount () {
        this.findAllAnimal ();
      }

      //escuta atualizações na lista
      componentDidUpdate (prevProps, prevState) {
        if (prevState.data !== this.state.data) {
          this.findAllAnimal ();
        }
      }
   
    deleteAnimal=(id)=> {
        this.findAnimalById(id)
        if (this.state.dataId != null || this.state.dataId != undefined) {
            AnimalService.deleteById(id)
            alert("動物は正常に削除されました: ")
        }
    }

    insertAnimal=(item)=> {
        let file:Animal=new Animal()
        file.nome=item

        const insertId=AnimalService.addData(file);
        if(insertId==null || insertId==undefined){
            alert("新しい動物を挿入できません")
        }
    }

    findAllAnimal=()=> {
        AnimalService.findAll()
            .then((response: any) => {
                this.setState({
                    data: response._array,
                    isLoading: false,
                })
            }), (error) => {
                console.log(error);
            }
    }
    findAnimalById=(id)=> {
        AnimalService.findById(id)
            .then((response: any) => {
                if (response._array.length >0 && response!= null && response!= undefined) {
                    this.setState({
                        dataId: response._array[0]
                    })
                } else {
                    alert("IDが見つかりません")
                }
            }), (error) => {
                console.log(error);
            }
    }
    render() {

        //extrai as propriedades entre chaves
        const {data,value,dataInsert} = this.state;
        
        const animalList = data.map((item, key) => {
            return (
              <View key={key} style={styles.animalContainer}>
                <Text>ID: {item.id}</Text>
                <Text>Nome do Animal: {item.nome}</Text>
                <View style={styles.divider} />
              </View>
            );
          });

        return (

            <View style={styles.container}>

                <Text style={{ fontSize: 20, paddingBottom: 20 }}>動物を挿入する</Text>
                <TextInput
                    placeholder="動物ID"
                    style={styles.textInput}
                    onChangeText={text => { this.setState({ value: text }) }}
                    value={value}
                />
               <View style={styles.containerTouch}>
                    <TouchableOpacity onPress={() => { value == null ? alert("ID フィールドを空にすることはできません") : this.deleteAnimal(value) }} style={{ alignItems: "center", backgroundColor: '#00B3AD' }}>
                        <Icon name="md-remove" size={30} color="white" />
                    </TouchableOpacity>
                </View>
                <TextInput
                    placeholder="動物の名前"
                    style={styles.textInput}
                    onChangeText={textAdd => { this.setState({ dataInsert: textAdd }) }}
                    value={dataInsert}
                />
               
                <View style={styles.containerTouch}>
                    <TouchableOpacity onPress={() =>  dataInsert == null ? alert("名前フィールドを空にすることはできません") :this.insertAnimal(dataInsert)} style={{ alignItems: "center", backgroundColor: '#00B3AD' }}>
                        <Icon name="md-add" size={30} color="white" />
                    </TouchableOpacity>
                </View>
                {animalList}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    textInput:{
        alignItems: "center", 
        width: 200, 
        height: 40, 
        borderColor: '#FF6B1A', 
        borderWidth: 1 
    },
    containerTouch:{
        width: 200,
         padding: 10
    },

    animalContainer: {
        marginVertical: 10,
    },

    divider: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        marginVertical: 5,
    }
    
});
