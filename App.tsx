import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Platform, Text, View, SafeAreaView, Button } from 'react-native';
import { Picker } from "@react-native-picker/picker";

import api from "./src/services/api";
import { useEffect } from 'react';



export default function App() {
  
  
  
  
  interface BrandsProps {
    nome: string;
    codigo: string;
  }
  
  const [vehicles, setVehicles] = useState(["Carros", "Motos", "Caminhões"]);
  const [vehicleSelected, setVehicleSelected] = useState<string>();

  const [brands, setBrands] = useState<BrandsProps[]>([]);
  const [brandSelected, setBrandSelected] = useState<string>();

  const [models, setModels] = useState(["gol", "uno", "palio", "corsa", "saveiro", "fox"]);
  const [modelSelected, setModelSelected] = useState<string>();

  const [years, setYears] = useState(["2002", "2003", "2005", "2006", "2009", "2010", "2020"]);
  const [yearSelected, setYearSelected] = useState<string>();

  async function loadBrands() {
    api.get(`/${vehicleSelected}/marcas`).then((response)=>{
    //console.log(response.data)
    setBrands(response.data);
    });
  }

  useEffect(()=>{
    //console.log("useEffect")
    loadBrands();
  },[vehicleSelected])

  return (

    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>FipeMobile</Text>
      </View>



      <View style={styles.content}>
        <Text style={styles.title}>Selecione o tipo de veículo para a consulta</Text>
        <Picker
          selectedValue={vehicleSelected}
          style={styles.vehiclePicker}
          onValueChange={(itemValue) =>
            setVehicleSelected(itemValue)}
           
            >
          {
            vehicles.map(item => {
              return <Picker.Item label={item} value={item} />
            })
          }
        </Picker>


      </View>

      <View style={styles.selectContainer}>
        <Picker
          selectedValue={brandSelected}
          style={styles.picker}
          onValueChange={(itemValue) =>
            setBrandSelected(itemValue)
          }>
          {
            brands.map(item => {
              return <Picker.Item label={item.nome} value={item.nome} />
            })
          
          }
        </Picker>
        <Picker
          selectedValue={vehicleSelected}
          style={styles.picker}
          onValueChange={(itemValue) =>
            setModelSelected(itemValue)
          }>
          {
            models.map(vh => {
              return <Picker.Item label={vh} value={vh} />
            })
          }
        </Picker>
        <Picker
          selectedValue={vehicleSelected}
          style={styles.picker}
          onValueChange={(itemValue) =>
            setYearSelected(itemValue)
          }>
          {
            years.map(vh => {
              return <Picker.Item label={vh} value={vh} />
            })
          }
        </Picker>
      </View>
      <Button
        title={"Cadastrar planta"}
        onPress={()=>{console.log(models)}}
      />

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFF",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',


  },
  header: {
    height: 50,
    backgroundColor: "#02b7f2",
    display: "flex",
    alignItems: "center"
  },
  headerText: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
  },

  content: {
    padding: 15,

  },
  title: {
    fontSize: 18,
    fontWeight: '600',

  },
  vehiclePicker: {
    height: 50,
    width: 200,
    borderWidth: 2,
    borderColor: "#02b7f2",
  },
  picker: {
    height: 50,
    width: 130,
    borderWidth: 2,
    borderColor: "#02b7f2",
  },

  selectContainer: {
    backgroundColor: "red",
    display: "flex",
    flexDirection: 'row',
    paddingHorizontal: 15,
  }
});
