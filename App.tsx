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

  interface ModelsProps {
    nome: string;
    codigo: string;
  }

  interface YearProps {
    nome: string;
    codigo: string;
  }

  interface PriceProps {
    "Valor": string;
    "Marca": string;
    "Modelo": string;
    "AnoModelo": string;
    "Combustivel": string;
    "CodigoFipe": string;
    "MesReferencia": string;
    "TipoVeiculo": string;
    "SiglaCombustivel": string;
  }

  const [vehicles, setVehicles] = useState(["Selecione", "carros", "motos", "caminhões"]);
  const [vehicleSelected, setVehicleSelected] = useState<string>("Selecione");

  const [brands, setBrands] = useState<BrandsProps[]>([]);
  const [brandSelected, setBrandSelected] = useState<string>("");

  const [models, setModels] = useState<ModelsProps[]>([]);
  const [modelSelected, setModelSelected] = useState<string>("");

  const [years, setYears] = useState<YearProps[]>([]);
  const [yearSelected, setYearSelected] = useState<string>("");

  const [price, setPrice] = useState<PriceProps[]>([]);

  async function loadBrands() {
    api.get(`/${vehicleSelected}/marcas`).then((response) => {
      setBrands(response.data);
    });
  }

  async function loadModels() {
    api.get(`/${vehicleSelected}/marcas/${brandSelected}/modelos`).then((response => {
      const dados = response.data;
      setModels(dados["modelos"]);
    }
    ))
  }

  async function loadYears() {
    api.get(`/${vehicleSelected}/marcas/${brandSelected}/modelos/${modelSelected}/anos`).then((response => {
      setYears(response.data);
      console.log(response.data)
    }
    ))
  }

  async function loadPrice() {
    console.log(`/${vehicleSelected}/marcas/${brandSelected}/modelos/${modelSelected}/anos/${yearSelected}`)
    api.get(`/${vehicleSelected}/marcas/${brandSelected}/modelos/${modelSelected}/anos/${yearSelected}`).then(response => {
     console.log(response.data);
    })

  }

  useEffect(() => {

    if (vehicleSelected !== "Selecione") {
      console.log("useEffect")
      loadBrands();
    } else {
      setModels([]);
      setBrands([]);
      setYears([]);
    }
  }, [vehicleSelected])

  useEffect(() => {
    if (brandSelected !== "") {
      console.log("useEffect")
      loadModels();
    }
  }, [brandSelected])

  useEffect(() => {
    if (modelSelected !== "") {
      loadYears();
    }
  }, [modelSelected])


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
        {/* brandsPicker */}
        <Picker
          selectedValue={brandSelected}
          style={styles.picker}
          onValueChange={(itemValue) =>
            setBrandSelected(itemValue)
          }>
          {
            brands.map(item => {
              return <Picker.Item label={item.nome} value={item.codigo} />
            })

          }
        </Picker>
        {/* modelsPicker */}
        <Picker
          enabled={!!brandSelected}
          selectedValue={modelSelected}
          style={styles.picker}
          onValueChange={(itemValue) =>
            setModelSelected(itemValue)
          }>
          {
            models.map(item => {
              return <Picker.Item label={item.nome} value={item.codigo} />
            })
          }
        </Picker>
        {/* yearsPicker */}
        <Picker
          enabled={!!modelSelected}
          selectedValue={yearSelected}
          style={styles.picker}
          onValueChange={(itemValue) =>
            setYearSelected(itemValue)
          }>
          {
            years.map(item => {
              return <Picker.Item label={item.nome} value={item.codigo} />
            })
          }
        </Picker>
      </View>
      <Button
        title={"Cadastrar planta"}
        onPress={() => { loadPrice() }}
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
