import { StyleSheet, Text, View } from 'react-native'
import {STRAVA_URI} from "../../constants"
import React from 'react'

async function Query(base, data) {
    const headers = {'Content-Type': 'application/json'};
    console.log("URI", STRAVA_URI + base)
    try{
        const result = await fetch(STRAVA_URI + base, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });
        const res = await result.json()
        return res;

    }catch(e){
        return {'status' : 404};
    }
}


export {Query};