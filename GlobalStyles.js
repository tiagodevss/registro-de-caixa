import { StyleSheet } from "react-native";

export const Global = StyleSheet.create({
    h1: {
        fontFamily: "Inter_600SemiBold",
        textAlign: "center",
        fontSize: 23,
    },
    h2: {
        fontFamily: "Inter_500Medium",
        textAlign: "center",
        fontSize: 18,
    },
    h3: {
        fontFamily: "Inter_400Regular",
        textAlign: "center",
        fontSize: 15,
    },
    textInput: {
        width: "100%",
        height: 64,
        backgroundColor: "#fff",
        marginBottom: 15,
        borderRadius: 15,
        fontFamily: "Inter_400Regular",
        padding: 10,
    },
    picker: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#3D81CE",
        marginBottom: 15,
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        marginBottom: 100,
        flexDirection: "row",
        backgroundColor: "#3D81CE",
        borderRadius: 15,
    },
    iosPicker: {
        backgroundColor: "#fff",
        borderRadius: 15,
        marginBottom: 15,
    }
})