import { View, Text, StyleSheet } from 'react-native'
import { Global } from '../../GlobalStyles'

export default props => {

    const styles = StyleSheet.create({
        subContainer: {
            width: '100%',
            borderRadius: 10,
            backgroundColor: props.cor || "black",
            alignItems: "flex-end",
            overflow: 'hidden',
            marginTop: 20,
        },
        container: {
            width: '97%',
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 15,
        },
    })

    return (
        <View style={styles.subContainer}>
            <View style={styles.container}>
                <Text style={[Global.h2, { textAlign: 'left', fontSize: 23 }]}>{props.moeda} {props.numero}</Text>
                <Text style={[Global.h3, { textAlign: 'left' }]}>{props.children}</Text>
            </View>
        </View>
    )
}

