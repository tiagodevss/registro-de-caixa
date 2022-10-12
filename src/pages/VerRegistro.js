import { Text, StyleSheet, TextInput, View, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import { ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Global } from '../../GlobalStyles';
import MaskInput, { Masks, createNumberMask } from 'react-native-mask-input';
import { doc, deleteDoc } from "firebase/firestore";
import { db } from '../../Firebase-config';
import Spinner from 'react-native-loading-spinner-overlay';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarDocs, removeDoc, updateDoc } from '../functions/RegistrosFirestore';

export default props => {
    const dollarMask = createNumberMask({
        prefix: '',
        delimiter: '.',
        separator: ',',
        precision: 2,
    })

    const registro = props.route.params
    const [nome, setNome] = useState(registro.nome)
    const [descricao, setDescricao] = useState(registro.descricao)
    const [tipo, setTipo] = useState(registro.tipo)
    const [nomeClienteOuComprador, setNomeClienteOuComprador] = useState(registro.nomeClienteOuComprador)
    const [formaDePagamento, setFormaDePagamento] = useState(registro.formaDePagamento)
    const [valor, setValor] = useState(`${registro.valor}`)
    const [data, setData] = useState(registro.data)

    const id = registro.id
    const [loadingSpinner, setLoadingSpinner] = useState(false);

    async function handleUpdate() {
        setLoadingSpinner(true)
        try {
            await updateDoc({ nome, descricao, tipo, nomeClienteOuComprador, formaDePagamento, valor, data, id })
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
                    Alert.alert(
                        "Pronto!",
                        "Registro atualizado com sucesso.",
                        [
                            {
                                text: 'Fechar',
                                onPress: () => props.navigation.goBack()
                            }
                        ]
                    )
                })
        } catch (err) {
            setLoadingSpinner(false)
            console.warn(err)
            Alert.alert("Ops!", "Algo deu errado, tente novamente.", [{ text: 'Voltar' }])
        }
    }
    async function handleDelete() {
        try {
            Alert.alert(
                "Tem certeza?", "Não será possível recuperar este registro após a exclusão.",
                [
                    {
                        text: 'Voltar',
                    },
                    {
                        text: 'Confirmar',
                        onPress: () => confirmDelete()
                    }
                ]
            )

            async function confirmDelete() {
                setLoadingSpinner(true)
                
                await removeDoc(id)
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
                Alert.alert("Pronto!", "O registro foi excluído com sucesso.", [{ text: 'Fechar' }])
                props.navigation.goBack()

            }

        } catch (err) {
            console.warn(err)
            setLoadingSpinner(false)
            Alert.alert("Ops!", "Algo deu errado, tente novamente.", [{ text: 'Voltar' }])
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
                <Text style={Global.h3}>Tipo de movimento:</Text>
                <Picker
                    style={Global.picker}
                    selectedValue={tipo}
                    onValueChange={itemValue => setTipo(itemValue)}
                >
                    <Picker.Item label="Entrada" value="Entrada" />
                    <Picker.Item label="Saída" value="Saída" />
                </Picker>
                <Text style={Global.h3}>Nome do Cliente ou Comprador:</Text>
                <TextInput
                    value={nomeClienteOuComprador}
                    style={Global.textInput}
                    placeholder='Ex: Corujão Autopeças'
                    onChangeText={text => setNomeClienteOuComprador(text)}
                />
                <Text style={Global.h3}>Forma de Pagamento:</Text>
                <Picker
                    style={Global.picker}
                    selectedValue={formaDePagamento}
                    onValueChange={itemValue => setFormaDePagamento(itemValue)}
                >
                    <Picker.Item label="Dinheiro" value="Dinheiro" />
                    <Picker.Item label="Cartão de Débito" value="Cartão de Débito" />
                    <Picker.Item label="Cartão de Crédito" value="Cartão de Crédito" />
                    <Picker.Item label="Pix" value="Pix" />
                    <Picker.Item label="Boleto" value="Boleto" />
                </Picker>
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
                <View style={{ marginBottom: 50, flexDirection: "row", justifyContent: "space-evenly" }}>
                    <View style={{ width: "45%" }}>
                        <TouchableOpacity
                            style={[Global.button, { marginBottom: 0, backgroundColor: "#F56262" }]}
                            color={Global.button.backgroundColor}
                            onPress={handleDelete}
                        >
                            <Icon name='trash' type='font-awesome' color="#fff" />
                            <Text style={[Global.h3, { color: "#fff", marginLeft: 5 }]}>
                                Excluir
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: "45%" }}>
                        <TouchableOpacity
                            style={[Global.button, { marginBottom: 0, backgroundColor: "#2EAF50" }]}
                            color={Global.button.backgroundColor}
                            onPress={handleUpdate}
                        >
                            <Icon name='check' type='font-awesome' color="#fff" />
                            <Text style={[Global.h3, { color: "#fff", marginLeft: 5 }]}>
                                Atualizar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
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