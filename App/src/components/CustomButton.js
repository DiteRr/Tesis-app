import React from 'react'
import { View, Text, StyleSheet, Pressable} from 'react-native'


const CustomButton = ({testID, onPress, text}) => {
    return (
        <Pressable testID={testID} onPress={onPress} style={({pressed}) => [{backgroundColor: pressed ? '#5190B9' : '#FC4C02' }, styles.container]}>
            <Text style={styles.text}> {text} </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        //backgroundColor: '#6CBCF1',

        width: '80%',

        padding: 15,
        marginVertical: 5,  

        alignSelf: 'center',
        borderRadius: 5,
    },
    text: {
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    }
})

export default CustomButton