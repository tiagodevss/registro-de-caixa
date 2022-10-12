import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import { Icon } from 'react-native-elements'
import { Global } from '../../GlobalStyles'
import { MaskedTextInput } from "react-native-mask-text";
import { Picker } from '@react-native-picker/picker';
import IosDataPicker from './IosDataPicker';

export default ({ atualizarFiltros }) => {
    const [exibirFiltros, setExibirFiltros] = useState(false)

    //Pegar datas atuais
    const d = new Date();
    const mesAtual = d.getMonth() + 1
    const anoAtual = d.getFullYear()

    const infoMesAtual = new Date(anoAtual, mesAtual, 0).getDate()

    function generateRange(n) {
        return Array.from({ length: n }, (_, i) => i + 1);
    }
    const ultimoDadoDoArray = generateRange(infoMesAtual).slice(-1)[0]

    const primeiroDiaDoMes = "01"
    const ultimoDiaDoMes = `${ultimoDadoDoArray}`

    const [dataInicio, setDataInicio] = useState()
    const [dataTermino, setDataTermino] = useState()
    const [tipo, setTipo] = useState("Todos")
    const [formaDePagamento, setFormaDePagamento] = useState("Todos")

    const filtros = [{
        dataInicio: dataInicio,
        dataTermino: dataTermino,
        tipo: tipo,
        formaDePagamento: formaDePagamento,
    }]

    const [android, setAndroid] = useState(false)
    const [ios, setIos] = useState(false)

    function getPlatform() {
        if (Platform.OS === 'android') {
            setAndroid(true)
        } else if (Platform.OS === 'ios') {
            setIos(true)
        }
    }
    useEffect(() => {
        getPlatform()
    }, [])


    return (
        <>
            <TouchableOpacity
                style={[Global.button, { backgroundColor: "transparent", borderColor: "#5A5A5A", borderWidth: 1, marginBottom: 15 }]}
                onPress={() => {
                    exibirFiltros ? setExibirFiltros(false) : setExibirFiltros(true)
                }}
            >
                <Icon name='filter' type='font-awesome' size={25} color="#5A5A5A" />
                <Text style={[Global.h3, { color: "#5A5A5A" }]}>  {exibirFiltros ? "Esconder filtros" : "Mostrar filtros"}</Text>
            </TouchableOpacity>
            {
                exibirFiltros ?
                    <View style={{ borderBottomColor: "#757474", borderBottomWidth: StyleSheet.hairlineWidth, marginBottom: 10 }}>
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <View style={style.column50}>
                                <Text style={Global.h3}>Data Início:</Text>
                                <MaskedTextInput
                                    style={Global.textInput}
                                    mask="99/99/9999"
                                    value={dataInicio ? dataInicio : `${primeiroDiaDoMes}/${mesAtual}/${anoAtual}`}
                                    placeholder="dd/mm/yyyy"
                                    keyboardType="numeric"
                                    onChangeText={(text) => {
                                        setDataInicio(text);
                                    }}
                                />
                            </View>
                            <View style={style.column50}>
                                <Text style={Global.h3}>Data Término:</Text>
                                <MaskedTextInput
                                    style={Global.textInput}
                                    mask="99/99/9999"
                                    value={dataTermino ? dataTermino : `${ultimoDiaDoMes}/${mesAtual}/${anoAtual}`}
                                    placeholder="dd/mm/yyyy"
                                    keyboardType="numeric"
                                    onChangeText={(text) => {
                                        setDataTermino(text)
                                    }}
                                />
                            </View>
                        </View>



                        {android ?
                            <>
                                <Text style={Global.h3}>Tipo de movimento:</Text>
                                <Picker
                                    style={Global.picker}
                                    selectedValue={tipo}
                                    onValueChange={(itemValue) => {
                                        setTipo(itemValue)
                                    }}
                                >
                                    <Picker.Item label="Todos" value="Todos" />
                                    <Picker.Item label="Apenas Entrada" value="Entrada" />
                                    <Picker.Item label="Apenas Saída" value="Saída" />
                                </Picker>
                            </> : null}
                        {ios ?
                            <>
                                <Text style={Global.h3}>Tipo de movimento:</Text>
                                <IosDataPicker
                                    onValueChange={itemValue => setTipo(itemValue)}
                                    data={[
                                        { key: 1, label: 'Todos', value: 'Todos' },
                                        { key: 2, label: 'Apenas Entrada', value: 'Entrada' },
                                        { key: 3, label: 'Apenas Saída', value: 'Saída' }
                                    ]}
                                />
                            </> : null}




                        {android ?
                            <>
                                <Text style={Global.h3}>Forma de Pagamento:</Text>
                                <Picker
                                    style={Global.picker}
                                    selectedValue={formaDePagamento}
                                    onValueChange={(itemValue) => {
                                        setFormaDePagamento(itemValue)
                                    }}
                                >
                                    <Picker.Item label="Todos" value="Todos" />
                                    <Picker.Item label="Dinheiro" value="Dinheiro" />
                                    <Picker.Item label="Cartão de Débito" value="Cartão de Débito" />
                                    <Picker.Item label="Cartão de Crédito" value="Cartão de Crédito" />
                                    <Picker.Item label="Pix" value="Pix" />
                                    <Picker.Item label="Boleto" value="Boleto" />
                                </Picker>
                            </> : null}
                        {ios ?
                            <>
                                <Text style={Global.h3}>Forma de Pagamento:</Text>
                                <IosDataPicker
                                    onValueChange={itemValue => setFormaDePagamento(itemValue)}
                                    data={[
                                        { key: 1, label: 'Todos', value: 'Todos' },
                                        { key: 2, label: 'Dinheiro', value: 'Dinheiro' },
                                        { key: 3, label: 'Saída', value: 'Saída' },
                                        { key: 4, label: 'Cartão de Crédito', value: 'Cartão de Crédito' },
                                        { key: 5, label: 'Pix', value: 'Pix' },
                                        { key: 6, label: 'Boleto', value: 'Boleto' },
                                    ]}
                                />
                            </> : null}






                        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                            <TouchableOpacity
                                style={[Global.button, { marginBottom: 50, width: "45%", backgroundColor: "#FF9933" }]}
                                onPress={() => {
                                    setDataInicio(`${primeiroDiaDoMes}/${mesAtual}/${anoAtual}`)
                                    setDataTermino(`${ultimoDiaDoMes}/${mesAtual}/${anoAtual}`)
                                    setTipo("Todos")
                                    setFormaDePagamento("Todos")
                                    atualizarFiltros([{
                                        dataInicio: `${primeiroDiaDoMes}/${mesAtual}/${anoAtual}`,
                                        dataTermino: `${ultimoDiaDoMes}/${mesAtual}/${anoAtual}`,
                                        tipo: "Todos",
                                        formaDePagamento: "Todos",
                                    }])
                                }}
                            >
                                <Icon name='trash' type='font-awesome' size={25} color="#fff" />
                                <Text style={[Global.h3, { color: "#fff", marginLeft: 5 }]}>
                                    Limpar filtros
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[Global.button, { marginBottom: 50, width: "45%" }]}
                                color={Global.button.backgroundColor}
                                onPress={() => {
                                    atualizarFiltros(filtros)
                                }}
                            >
                                <Icon name='search' type='material' size={25} color="#fff" />
                                <Text style={[Global.h3, { color: "#fff", marginLeft: 5 }]}>
                                    Buscar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    null
            }
        </>
    )
}

const style = StyleSheet.create({
    column50: {
        width: '50%',
        flexDirection: 'column',
        padding: 5,
    },
})