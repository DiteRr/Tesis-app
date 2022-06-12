import { StyleSheet, Text, View, SafeAreaView} from 'react-native'
import React, { useEffect, useState } from 'react'
import {Slider} from '@miblanchard/react-native-slider';

function CustomSlider({valueChanged, color}) {
    //console.log(props)
    //const {valueChanged} = props
    //console.log(valueChanged)
    const [scale, setScale] = useState(0)
    const [mark, setMark] = useState(0)


    valueChanged(scale)

    const renderAboveThumbComponent = () => {
        return(
            <View style={aboveThumbStyles.container}> 
                <Text style = {aboveThumbStyles.text}> {scale} </Text> 
            </View>
        );
        

    };
    const renderTrackMarkComponent = (value) => {
        const currentSliderValue = value || (Array.isArray(value) && value[0]) || 0;
            const style =
                scale > Math.max(currentSliderValue)
                    ? trackMarkStyles.activeMark
                    : trackMarkStyles.inactiveMark;
            return <View style={style} />;
    }

  return (
    <View>
        <SafeAreaView>
                    <View style={styles.containerSlider}>
                        <Slider
                                value={scale}
                                onValueChange={setScale}
                                maximumValue={100} 
                                minimumValue={0}
                                step={1}
                                animateTransitions
                                minimumTrackTintColor = {color}
                                thumbTintColor = {color}
                                trackMarks={[100]}
                                trackStyle = {styles.trackStyle} 
                                renderTrackMarkComponent = {renderTrackMarkComponent}
                                renderAboveThumbComponent={renderAboveThumbComponent}
                        />
                    </View>
        </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
    containerSlider: {
        lex: 1,
        marginLeft: 20,
        marginRight: 20,
        //alignItems: 'stretch',
        justifyContent: 'center',
    },
    preguntaStyle: {
        fontWeight: "bold",
        fontSize: 18,
        paddingLeft: 15,
    },
})

const trackMarkStyles = StyleSheet.create({
    activeMark: {
        borderColor: '#6E6E6E',
        borderRadius: 20,   
        borderWidth : 3,
        left: 13,
    },
    inactiveMark: {
        borderColor: '#6E6E6E',
        borderRadius: 20,
        borderWidth : 3,
        left: 13,
    },
});

const aboveThumbStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 1,
        height: 20,
        justifyContent: 'center',
        left: -6,
        width: 30,
    },
    text: {
        fontWeight: "bold",
    }
});

export default CustomSlider