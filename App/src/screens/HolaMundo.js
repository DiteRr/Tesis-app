import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button, Pressable} from 'react-native'

function Holamundo() {

    return (
        <View>
            <Text>Hola mundo</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 20,
        margin: 10,
      },
})

export default Holamundo;