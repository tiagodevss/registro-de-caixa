import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Global } from '../../GlobalStyles';
import Etiqueta from "./Etiqueta";

export default props => {
    return (
        <TouchableOpacity style={style.itemLista} onPress={props.onPress}>
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <Text style={[Global.h2, { textAlign: "left", width: "75%" }]}>
                    {props.nome}
                </Text>
                <View style={{ flexDirection: "row-reverse", width: "25%", height: "100%" }}>
                    <Etiqueta texto={props.tipo} />
                </View>
            </View>
            <View>
                <Text>{props.descricao}</Text>
                <Text style={{color: "#A1A1A1"}}>{`R$ ${props.valor}`} - {props.nomeClienteOuComprador} - {props.data}</Text>
            </View>
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    itemLista: {
        backgroundColor: '#fff',
        borderRadius: 15,
        width: '100%',
        minHeight: 100,
        padding: 15,
        marginTop: 10,
    },
})