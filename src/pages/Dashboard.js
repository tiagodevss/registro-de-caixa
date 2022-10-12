import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Text, StyleSheet, RefreshControl, Platform } from 'react-native';
import { ScrollView } from 'react-native';
import CardEstatistica from '../components/CardEstatistica';
import { auth, db } from '../../Firebase-config'
import { Global } from '../../GlobalStyles';
import { buscarDocs } from '../functions/RegistrosFirestore';

export default props => {
    const [registros, setRegistros] = useState()
    const [valorEntradas, setValorEntradas] = useState(0)
    const [valorSaidas, setValorSaidas] = useState(0)
    const [refresh, setRefresh] = useState(false)

    const user = auth.currentUser

    async function consultarFirestore() {
        await buscarDocs().then(async (res) => {
            await AsyncStorage.setItem("registros", JSON.stringify(res))
            setRegistros(res)
        })
    }

    async function buscarConfirmacaoDeRegistros() {
        await AsyncStorage.getItem("registros").then((res) => {
            if (res === null) {
                consultarFirestore();
            } else {
                const resJson = JSON.parse(res)
                setRegistros(resJson)

                function filtrarEntradas(item) {
                    return item.tipo === "Entrada";
                }
                const arrayFiltrado = resJson.filter(filtrarEntradas)
                const valorFinalEntradas = arrayFiltrado.map((item) => {
                    return item.valor = parseFloat(item.valor.replace(".", "").replace(",", "."))
                }).reduce((prev, curr) => prev + curr, 0)

                if (Platform.OS === "ios") {
                    setValorEntradas(valorFinalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 }))
                } else if (Platform.OS === "android") {
                    function numberToMoney(amount, simbol = '', decimalCount = 2, decimal = ",", thousands = ".") {
                        decimalCount = Math.abs(decimalCount)
                        decimalCount = isNaN(decimalCount) ? 2 : decimalCount

                        const negativeSign = amount < 0 ? "-" : ""

                        const i = parseInt(amount = Math.abs(Number(amount) ||
                            0).toFixed(decimalCount)).toString()
                        const j = (i.length > 3) ? i.length % 3 : 0

                        return simbol + negativeSign + (j ? i.substr(0, j) + thousands : '') +
                            i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ?
                                decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "")
                    };
                    setValorEntradas(numberToMoney(valorFinalEntradas))
                }

                //------------------------------------------

                function filtrarSaidas(item) {
                    return item.tipo === "Saída";
                }
                const arrayFiltrado1 = resJson.filter(filtrarSaidas)
                const valorFinalSaidas = arrayFiltrado1.map((item) => {
                    return item.valor = parseFloat(item.valor.replace(".", "").replace(",", "."))
                }).reduce((prev, curr) => prev + curr, 0)

                if (Platform.OS === "ios") {
                    setValorSaidas(valorFinalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 }))
                } else if (Platform.OS === "android") {
                    function numberToMoney(amount, simbol = '', decimalCount = 2, decimal
                        = ",", thousands = ".") {
                        decimalCount = Math.abs(decimalCount)
                        decimalCount = isNaN(decimalCount) ? 2 : decimalCount

                        const negativeSign = amount < 0 ? "-" : ""

                        const i = parseInt(amount = Math.abs(Number(amount) ||
                            0).toFixed(decimalCount)).toString()
                        const j = (i.length > 3) ? i.length % 3 : 0

                        return simbol + negativeSign + (j ? i.substr(0, j) + thousands : '') +
                            i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ?
                                decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "")
                    };
                    setValorSaidas(numberToMoney(valorFinalSaidas))
                }

                //setValorSaidas(arrayDeValores1)
                //if (arrayDeValores1 === ''){
                //setValorSaidas(0)
                //}

            }
        }, (err) => {
            console.warn(err)
        })
    }

    useEffect(() => {
        buscarConfirmacaoDeRegistros()
    }, [registros]);

    return (
        <ScrollView style={style.content} refreshControl={
            <RefreshControl
                refreshing={refresh}
                onRefresh={() => {
                    buscarConfirmacaoDeRegistros()
                }}
            />
        }>
            <Text style={Global.h1}>Olá, {user?.displayName}! 😁</Text>
            <Text style={Global.h3}>Acompanhe seus movimentos financeiros:</Text>
            <CardEstatistica moeda="R$" numero={valorEntradas} cor="#1AAE4B">
                Valor total de entradas (mês atual).
            </CardEstatistica>
            <CardEstatistica moeda="R$" numero={valorSaidas} cor="#FF3333">
                Valor total de saídas (mês atual).
            </CardEstatistica>
            <CardEstatistica moeda={null} numero={registros?.length} cor="#3C7FD7">
                Quant. de registros de entradas e saídas este mês.
            </CardEstatistica>

        </ScrollView>
    )
}

const style = StyleSheet.create({
    content: {
        width: '100%',
        height: '100%',
        padding: 15,
    }
})