import React,{useState, Component} from "react";
import {StyleSheet, View, Image} from "react-native";

import imageApi from "./imageApi";

const [imageLink, setImageLink] =useState("");

interface ImageProps extends Image{
    model:string;
}


const params = {
    engine: "google",
    ijn: "0",
    q: "",
    google_domain: "google.com.br",
    tbm: "isch",
    safe: "active",
    hl: "pt",
    gl: "br",
    location: "Brazil"
};

const callback = function (data: any) {
    console.log(data['images_results']);
};

async function pesquisa(q: string) {
    params.q = q;

    await imageApi.get(`search.json?q=${params.q}&tbm=${params.tbm}&ijn=${params.ijn}&api_key=f6116fc61513f12cfe33423d29eeec99d4dd36abed22855423426beee7f9059b`).then((response => {
        //console.log(response.data["images_results"][0]["original"]);
        //setImageLink(response.data["images_results"][0]["original"]);
        return response.data["images_results"][0]["original"]
    }
    ))
}

export function CarImage({model}:ImageProps){
    return(
        <View>
            <Image
                source={{uri:`${pesquisa(model)}`}}
            >
            </Image>
        </View>
    )
}