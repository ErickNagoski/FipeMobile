import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Platform, Text, View, SafeAreaView, Button, FlatList, Alert, ActivityIndicator, Touchable, TouchableOpacity } from 'react-native';
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

  const [query, setQuery] = useState<string>("");

  const [loading, setLoading] = useState(false);


  async function loadBrands() {
    await api.get(`/${vehicleSelected}/marcas`).then((response) => {
      setBrands(response.data);
      setLoading(false);
    });
  }

  async function loadModels() {
    await api.get(`/${vehicleSelected}/marcas/${brandSelected}/modelos`).then((response => {
      const dados = response.data;
      setModels(dados["modelos"]);
      setLoading(false);
    }
    ))
  }

  async function loadYears() {
    await api.get(`/${vehicleSelected}/marcas/${brandSelected}/modelos/${modelSelected}/anos`).then((response => {
      setYears(response.data);
      setLoading(false);
    }
    ))
  }

  async function loadPrice() {
    await api.get(query).then(response => {
      setPrice(response.data);
      setLoading(false);
    }).catch(function (error) {
      Alert.alert("Erro na consulta");
      setLoading(false)
    });

  }

  useEffect(() => {
    setQuery(`/${vehicleSelected}/marcas/${brandSelected}/modelos/${modelSelected}/anos/${yearSelected}`);
  });

  useEffect(() => {

    if (vehicleSelected !== "Selecione") {
      setLoading(true);
      loadBrands();
    } else {
      setBrands([]);
      setModels([]);
      setYears([]);
    }
  }, [vehicleSelected])

  useEffect(() => {
    if (brandSelected !== "") {
      setLoading(true);
      loadModels();
      setModelSelected("");
      setYearSelected("");
    }
  }, [brandSelected])

  useEffect(() => {
    if (modelSelected !== "") {
      setLoading(true);
      loadYears();
      setYearSelected("");
    }
  }, [modelSelected])

  useEffect(() => {
  }, [yearSelected])

  if (loading) {
    return <View style={styles.containerLoading}>
      <ActivityIndicator
        size="large"
        color="#02b7f2"
      />
      <Text>Aguarde...</Text>
    </View>
  } else {
    return (

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>FipeMobile</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Selecione o tipo de veículo para a consulta</Text>
          <Picker
            selectedValue={vehicleSelected}
            style={styles.vehiclePicker}
            onValueChange={(itemValue) =>
              setVehicleSelected(itemValue)}>
            {
              vehicles.map((item, index) => {
                return <Picker.Item key={index} label={item} value={item} />
              })
            }
          </Picker>


        </View>
        <View style={styles.labelPickerView}>
          
          <Text style={styles.pickerLabel}>Marca</Text>
          <Text style={styles.pickerLabel}>Modelo</Text>
          <Text style={styles.pickerLabel}>Ano</Text>
       
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
              brands.map((item) => {
                return <Picker.Item key={item.codigo} label={item.nome} value={item.codigo} />
              })
            }
          </Picker>
          
          {/* modelsPicker */}
          <Picker
            enabled={brandSelected != ""}
            selectedValue={modelSelected}
            style={styles.picker}
            onValueChange={(itemValue) =>
              setModelSelected(itemValue)
            }>
            {
              models.map(item => {
                return <Picker.Item key={item.codigo} label={item.nome} value={item.codigo} />
              })
            }
          </Picker>
        
          {/* yearsPicker */}
          <Picker
            enabled={modelSelected != ""}
            selectedValue={yearSelected}
            style={styles.picker}
            onValueChange={(itemValue) => {
              setYearSelected(itemValue)
            }
            }>
            {
              years.map(item => {
                return <Picker.Item key={item.codigo} label={item.nome} value={item.codigo} />
              })
            }
          </Picker>
        
        </View>
        {/* <Text>{query}</Text> */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setQuery(`/${vehicleSelected}/marcas/${brandSelected}/modelos/${modelSelected}/anos/${yearSelected}`);
              setLoading(true);
              loadPrice()
            }}>
            <Text style={styles.textButton}>Consultar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listbody}>
          {
            Object.entries(price).map(item => {
              return <Text style={styles.listItem}>{item[0]} -- {item[1]}</Text>
            })
          }
        </View>

        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFF",
    paddingTop: Platform.OS === "android" ? 35 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 50,
    display: "flex",
    alignItems: "center"
  },
  headerTextContainer: {
    width: 300,
    backgroundColor: "#02b7f2",
    borderRadius: 20,
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
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
  },
  labelPickerView: {
    marginHorizontal: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  picker: {
    height: 50,
    width: 130,
    borderWidth: 2,
    borderColor: "#02b7f2",
  },

  pickerLabel: {
    fontSize: 15,
  },

  selectContainer: {
    display: "flex",
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignContent: "space-between"
  },

  buttonContainer: {
    display: "flex",
    alignItems: "center",
    marginVertical: 10
  },
  button: {
    backgroundColor: "#02b7f2",
    padding: 5,
    width: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  textButton: {
    fontSize: 20,
    color: "white",
    fontWeight: "700",
  },
  listbody: {
    marginHorizontal: 15,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: "#02b7f2",
  },
  listItem: {
    fontSize: 16,
    marginBottom: 5,
    borderColor: "rgb(230,230,230)"
  },
  containerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  }

});
