import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native';
import ListaRelatorio from '../components/ListaRelatorio';
import BotaoFiltros from '../components/BotaoFiltros';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarDocs } from '../functions/RegistrosFirestore';

export default props => {
    const [registrosFiltrados, setRegistrosFiltrados] = useState()
    const [registrosTotais, setRegistrosTotais] = useState([])
    const [refresh, setRefresh] = useState(false)

    const [dataInicio, setDataInicio] = useState()
    const [dataTermino, setDataTermino] = useState("")
    const [tipo, setTipo] = useState("Todos")
    const [formaDePagamento, setFormaDePagamento] = useState("Todos")

    const [filtros, setFiltros] = useState([])

    async function consultarFirestore() {
        await buscarDocs().then(async (res) => {
            await AsyncStorage.setItem("registros", JSON.stringify(res))
            setRegistrosTotais(res)
        })
    }

    const buscarConfirmacaoDeRegistros = async () => {
        await AsyncStorage.getItem("registros").then((res) => {
            if (res === null) {
                consultarFirestore();
            } else {
                setRegistrosTotais(JSON.parse(res))
            }
        }, (err) => {
            console.warn(err)
        })
    }

    useEffect(() => {
        buscarConfirmacaoDeRegistros()
        consultarFirestore()
    }, [props.route.params?.post]);

    //obter mês e ano atual
    const data = new Date()
    const mesAtual = data.getMonth() + 1
    const anoAtual = data.getFullYear()

    //Obter quantidade de dias no mês atual
    const data1 = new Date(anoAtual, mesAtual, 0);
    const quantDiasMesAtual = data1.getDate()

    //Funções de Filtros para os Registros
    function filtrarDatas(item, e) {
        if (
            item.data >= e.dataInicio &&
            item.data <= e.dataTermino
        ) {
            return item
        }
    }
    function filtrarTipo(item, e) {
        if (e.tipo === "Todos") {
            if (item.tipo === "Entrada" || item.tipo === "Saída") {
                return item
            }
        } else if (e.tipo === "Entrada") {
            if (item.tipo === "Entrada") {
                return item
            }
        } else {
            if (item.tipo === "Saída") {
                return item
            }
        }
    }
    function filtrarFormaDePagamento(item, e) {
        if (e.formaDePagamento === "Todos") {
            if (
                item.formaDePagamento === "Dinheiro" ||
                item.formaDePagamento === "Cartão de Débito" ||
                item.formaDePagamento === "Cartão de Crédito" ||
                item.formaDePagamento === "Pix" ||
                item.formaDePagamento === "Boleto"
            ) {
                return item
            }
        } else if (e.formaDePagamento === "Dinheiro") {
            if (item.formaDePagamento === "Dinheiro") {
                return item
            }
        } else if (e.formaDePagamento === "Cartão de Débito") {
            if (item.formaDePagamento === "Cartão de Débito") {
                return item
            }
        } else if (e.formaDePagamento === "Cartão de Crédito") {
            if (item.formaDePagamento === "Cartão de Crédito") {
                return item
            }
        } else if (e.formaDePagamento === "Pix") {
            if (item.formaDePagamento === "Pix") {
                return item
            }
        } else if (e.formaDePagamento === "Boleto") {
            if (item.formaDePagamento === "Boleto") {
                return item
            }
        }
    }

    function filtrar(e) {
        const objFiltrado = registrosTotais.filter((item) => filtrarDatas(item, e))
        const objFiltrado1 = objFiltrado.filter((item) => filtrarTipo(item, e))
        const objFiltrado2 = objFiltrado1.filter((item) => filtrarFormaDePagamento(item, e))
        setRegistrosFiltrados(objFiltrado2)
    }

    return (
        <>
            <ScrollView
                style={style.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={() => {
                            buscarConfirmacaoDeRegistros()
                            //consultarFirestore()
                        }}
                    />
                }
            >
                <BotaoFiltros atualizarFiltros={(e) => {
                    filtrar(e[0])
                }} />
                <Text style={{ color: "#757474", textAlign: 'center' }}>
                    Mostrando {registrosTotais?.length} resultados de {dataInicio || `01/${mesAtual}/${anoAtual}`} até {dataTermino || `${quantDiasMesAtual}/${mesAtual}/${anoAtual}`}. {'\n'} Clique nos tópicos abaixo para ver mais:
                </Text>
                <View style={{ marginBottom: 50 }}>
                    {(registrosFiltrados ? registrosFiltrados : registrosTotais).map(registro => {
                        return (
                            <ListaRelatorio
                                key={registro.id}
                                nome={registro.nome}
                                tipo={registro.tipo}
                                descricao={registro.descricao}
                                valor={registro.valor}
                                data={registro.data}
                                nomeClienteOuComprador={registro.nomeClienteOuComprador}
                                onPress={() => {
                                    props.navigation.navigate("Ver Registro", registro)
                                }}
                            />
                        )
                    })}
                </View>
            </ScrollView>
        </>
    )
}

const style = StyleSheet.create({
    content: {
        width: '100%',
        height: '100%',
        padding: 15,
    }
})