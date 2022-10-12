import { Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { Global } from '../../GlobalStyles';
import MaskInput, { Masks, createNumberMask } from 'react-native-mask-input';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IosDataPicker from '../components/IosDataPicker'
import { buscarDocs, addDoc } from './../functions/RegistrosFirestore'

const dollarMask = createNumberMask({
    prefix: '',
    delimiter: '.',
    separator: ',',
    precision: 2,
})

export default props => {
    const [nome, setNome] = useState("")
    const [descricao, setDescricao] = useState("")
    const [tipo, setTipo] = useState("Entrada")
    const [nomeClienteOuComprador, setNomeClienteOuComprador] = useState("")
    const [formaDePagamento, setFormaDePagamento] = useState("Dinheiro")
    const [valor, setValor] = useState("")
    const [data, setData] = useState("")

    const [loadingSpinner, setLoadingSpinner] = useState(false);
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

    async function handleSubmit() {
        setLoadingSpinner(true)
        try {
            if (!nome || !descricao || !tipo || !nomeClienteOuComprador || !formaDePagamento || !valor || !data) {
                setLoadingSpinner(false)
                return Alert.alert("Verifique os campos!", "Há campos que não foram preenchidos.", [{ text: 'Voltar' }])

            } else {
                await addDoc({ nome, descricao, tipo, nomeClienteOuComprador, formaDePagamento, valor, data })
                    .then(async () => {
                        await buscarDocs().then(async (res) => {
                            await AsyncStorage.setItem("registros", JSON.stringify(res))
                        })

                        setNome("")
                        setDescricao("")
                        setTipo("Entrada")
                        setNomeClienteOuComprador("")
                        setFormaDePagamento("Dinheiro")
                        setValor("")
                        setData("")

                        setLoadingSpinner(false)
                        Alert.alert("Pronto!", "Registro adicionado com sucesso.", [{ text: 'Fechar' }])
                    })
            }

        } catch (err) {
            console.warn(err)
            setLoadingSpinner(false)
            Alert.alert("Ops!", "Algo deu errado!", [{ text: 'Voltar' }])
        }
    }

    return (
        <KeyboardAvoidingView behavior="height" enabled>
            <ScrollView style={style.content}>

                <Text style={Global.h3}>Nome:</Text>
                <TextInput
                    value={nome}
                    style={Global.textInput}
                    placeholder='Ex: Compra de Junta Homocinética'
                    onChangeText={text => setNome(text)}

                />
                <Text style={Global.h3}>Descrição:</Text>
                <TextInput
                    value={descricao}
                    style={Global.textInput}
                    placeholder='Ex: Peça comprada para Fiesta 2009'
                    onChangeText={text => setDescricao(text)}
                />

                {android ?
                    <>
                        <Text style={Global.h3}>Tipo de movimento:</Text>
                        <Picker
                            style={android ? Global.picker : Global.iosPicker}
                            selectedValue={tipo}
                            onValueChange={itemValue => setTipo(itemValue)}
                        >
                            <Picker.Item label="Entrada" value="Entrada" />
                            <Picker.Item label="Saída" value="Saída" />
                        </Picker>
                    </> : null}
                {ios ?
                    <>
                        <Text style={Global.h3}>Tipo de movimento:</Text>
                        <IosDataPicker
                            onValueChange={itemValue => setTipo(itemValue)}
                            data={[
                                { key: 1, label: 'Entrada', value: "Entrada" },
                                { key: 2, label: 'Saída', value: "Saída" },
                            ]}
                        />
                    </> : null}

                <Text style={Global.h3}>Nome do Cliente ou Estabelecimento:</Text>
                <TextInput
                    value={nomeClienteOuComprador}
                    style={Global.textInput}
                    placeholder='Ex: Corujão Autopeças'
                    onChangeText={text => setNomeClienteOuComprador(text)}
                />

                {android ?
                    <>
                        <Text style={Global.h3}>Forma de Pagamento:</Text>
                        <Picker
                            style={Global.iosPicker}
                            selectedValue={formaDePagamento}
                            onValueChange={itemValue => setFormaDePagamento(itemValue)}
                        >
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
                                { key: 1, label: 'Dinheiro', value: 'Dinheiro' },
                                { key: 2, label: 'Saída', value: 'Saída' },
                                { key: 3, label: 'Cartão de Crédito', value: 'Cartão de Crédito' },
                                { key: 4, label: 'Pix', value: 'Pix' },
                                { key: 5, label: 'Boleto', value: 'Boleto' },
                            ]}
                        />
                    </> : null}


                <Text style={Global.h3}>Valor:</Text>
                <MaskInput
                    value={valor}
                    style={Global.textInput}
                    keyboardType={"numeric"}
                    onChangeText={(masked) => {
                        setValor(masked)
                    }}
                    mask={dollarMask}
                />
                <Text style={Global.h3}>Data:</Text>
                <MaskInput
                    value={data}
                    style={Global.textInput}
                    keyboardType={"numeric"}
                    onChangeText={(masked) => {
                        setData(masked)
                    }}
                    mask={Masks.DATE_DDMMYYYY}
                />
                <TouchableOpacity
                    style={Global.button}
                    color={Global.button.backgroundColor}
                    onPress={handleSubmit}
                >
                    <Text style={[Global.h3, { color: "#fff" }]}>Registrar!</Text>
                </TouchableOpacity>
                <Spinner
                    visible={loadingSpinner}
                    textContent={'Carregando...'}
                    textStyle={{ color: '#fff' }}
                    overlayColor={"rgba(0, 0, 0, 0.40)"}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const style = StyleSheet.create({
    content: {
        width: '100%',
        height: '100%',
        padding: 15,
    }
})