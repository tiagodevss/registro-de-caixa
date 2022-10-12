import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default props => {

    let corEtiqueta = ""

    if (props.texto === "Entrada"){
        corEtiqueta = "#0A8336"
    } else {
        corEtiqueta = "#D73E3E"
    }

    const style = StyleSheet.create({
        etiqueta: {
            backgroundColor: corEtiqueta,
            height: "auto",
            width: "auto",
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
            borderRadius: 10,
            alignSelf: "flex-start",
        },
    })

    return(
        <View style={style.etiqueta}>
            <Text style={{color: "white"}}>{props.texto}</Text>
        </View>
    )
}
