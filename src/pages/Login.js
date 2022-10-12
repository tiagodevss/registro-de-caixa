import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from "react-native";
import { Entypo } from '@expo/vector-icons';
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import * as SecureStore from 'expo-secure-store';
import Spinner from 'react-native-loading-spinner-overlay';
import { auth } from '../../Firebase-config';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loadingSpinner, setLoadingSpinner] = useState(false);

    async function handleLogin() {
        setLoadingSpinner(true);
        try {
            await signInWithEmailAndPassword(auth, email, password)
                .then(async (user) => {
                    const stringUser = JSON.stringify(user.user.uid)
                    await AsyncStorage.removeItem("registros")
                    await SecureStore.setItemAsync("user", stringUser)
                }).catch(() => {
                    Alert.alert("Login Inválido!", "Verifique o email e senha e tente novamente.")
                })
            setLoadingSpinner(false)

        } catch (e) {
            console.warn(e)
            Alert.alert("Login Inválido!", "Verifique o email e senha e tente novamente.")
            setLoadingSpinner(false);
        }
    }

    return (
        <ScrollView style={styles.loginPage}>
            <Image source={require("../assets/loginImage.jpg")} style={{ width: "100%", height: 300, resizeMode: "contain" }}></Image>
            <View style={styles.formLogin}>
                <Text style={{ fontSize: 32, fontWeight: "600", marginLeft: 15, marginBottom: 20 }}>Login</Text>
                <View style={styles.containerLoginInput}>
                    <Entypo style={{ alignSelf: "center", marginRight: 10 }} name="email" size={24} color="#DFDFDF" />
                    <TextInput
                        style={styles.campoLogin}
                        placeholder="Email"
                        onChangeText={(value) => {
                            setEmail(value);
                        }}
                    />
                </View>
                <View style={styles.containerLoginInput}>
                    <Entypo style={{ alignSelf: "center", marginRight: 10 }} name="key" size={24} color="#DFDFDF" />
                    <TextInput
                        style={styles.campoLogin}
                        placeholder="Senha"
                        secureTextEntry={true}
                        onChangeText={(value) => {
                            setPassword(value)
                        }}
                    />
                </View>
                <TouchableOpacity
                    style={styles.botaoLoginRegistrar}
                    onPress={handleLogin}
                >
                    <Text style={{ color: "white", fontSize: 18 }}>Entrar</Text>
                </TouchableOpacity>
                <Text
                    style={{ color: "#3D81CE", textAlign: "center", marginTop: 15 }}
                >
                    Esqueceu sua senha?
                </Text>
                <Text style={{ color: "#929292", fontSize: 16, textAlign: "center", marginTop: 25 }}>--- Ou ---</Text>
                <TouchableOpacity style={styles.botaoLoginGoogle} onPress={() => handleGoogleLogin()}>
                    <Image source={require("../assets/logoGoogle.png")} style={{ width: 28, height: 28, marginRight: 10 }}></Image>
                    <Text style={{ fontSize: 15 }}>Continuar com Google</Text>
                </TouchableOpacity>
                <Text style={{ textAlign: "center", marginTop: 15 }}>
                    Quer se registrar?
                    <Text onPress={() => navigation.navigate("Registrar")} style={{ color: "#3D81CE" }}> Clique aqui</Text>
                </Text>

                <Spinner
                    visible={loadingSpinner}
                    textContent={'Carregando...'}
                    textStyle={{ color: '#fff' }}
                    overlayColor={"rgba(0, 0, 0, 0.40)"}
                />

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    loginPage: {
        width: '100%',
        height: '100%',
        display: 'flex',
        backgroundColor: '#fff',
    },
    formLogin: {
        padding: 15,
    },
    containerLoginInput: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        borderTopColor: '#fff',
        borderRightColor: '#fff',
        borderLeftColor: '#fff',
        borderBottomColor: "#dfdfdf",
        borderWidth: 1
    },
    campoLogin: {
        width: '100%',
        height: 60,
        padding: 10,
    },
    botaoLoginRegistrar: {
        marginTop: 30,
        width: '100%',
        height: 60,
        backgroundColor: '#3D81CE',
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    botaoLoginGoogle: {
        marginTop: 30,
        width: '100%',
        height: 60,
        backgroundColor: '#EFEFEF',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
})