import axios from "axios"

const API_URL = (field : number) => `https://api.thingspeak.com/channels/202842/field/${field}/`//`https://api.thingspeak.com/channels/202842/fields/${field}?api_key=OQVXLHD2PQ4SWS7G`

interface requestConfig {
    method: "GET",
    url? : string
}

const basicConfig : requestConfig = {
    method: "GET"
}

//date part in format like '?start=2022-11-11 10:10:10&end=2022-11-11 10:20:10'

const getDHT22_temperature = () => {
    let config = basicConfig
    config.url = API_URL(1)

    return axios(config)    
}

const getDHT22_temperatureStartAndEndDate = (startDate : string, endDate : string) => {
    let config = basicConfig
    config.url = API_URL(1) + `?start=${startDate}&end=${endDate}`

    return axios(config)    
}

// Wilgotność względna
const getDHT22_relativeHumidity = () => {
    let config = basicConfig
    config.url = API_URL(2)

    return axios(config)  
}

// Wilgotność względna
const getDHT22_relativeHumidityStartAndEndDate = (startDate : string, endDate : string) => {
    let config = basicConfig
    config.url = API_URL(2) + `?start=${startDate}&end=${endDate}`

    return axios(config)  
}

const getBH1750_lightIntensity = () => {
    let config = basicConfig
    config.url = API_URL(3)

    return axios(config)  
}

const getBH1750_lightIntensityStartAndEndDate = (startDate : string, endDate : string) => {
    let config = basicConfig
    config.url = API_URL(3) + `?start=${startDate}&end=${endDate}`

    return axios(config)  
}

const getBMP180_airPressure = () => {
    let config = basicConfig
    config.url = API_URL(4)

    return axios(config)  
}

const getBMP180_airPressureStartAndEndDate = (startDate : string, endDate : string) => {
    let config = basicConfig
    config.url = API_URL(4) + `?start=${startDate}&end=${endDate}`

    return axios(config)  
}

const getDS18B20_heaterTemperature = () => {
    let config = basicConfig
    config.url = API_URL(5)

    return axios(config)  
}

const getDS18B20_heaterTemperatureStartAndEndDate = (startDate : string, endDate : string) => {
    let config = basicConfig
    config.url = API_URL(5)  + `?start=${startDate}&end=${endDate}`

    return axios(config)  
}

const getDS18B20_temperature = () => {

    let config = basicConfig
    config.url = API_URL(6)

    return axios(config)
}

const getDS18B20_temperatureStartAndEndDate = (startDate : string, endDate : string) => {

    let config = basicConfig
    config.url = API_URL(6) + `?start=${startDate}&end=${endDate}`

    return axios(config)
}

const getMoveIndicator = () => {

    let config = basicConfig
    config.url = API_URL(7)

    return axios(config)
}

const getMoveIndicatorStartAndEndDate = (startDate : string, endDate : string) => {

    let config = basicConfig
    config.url = API_URL(7) + `?start=${startDate}&end=${endDate}`

    return axios(config)
}

const getBMP180_temperature = () => {

    let config = basicConfig
    config.url = API_URL(8)

    return axios(config)
}

const getBMP180_temperatureStartAndEndDate = (startDate : string, endDate : string) => {

    let config = basicConfig
    config.url = API_URL(8) + `?start=${startDate}&end=${endDate}`

    return axios(config)
}

const labService = {
    getDHT22_temperature,
    getDHT22_temperatureStartAndEndDate,

    getDHT22_relativeHumidity,
    getDHT22_relativeHumidityStartAndEndDate,

    getBH1750_lightIntensity,
    getBH1750_lightIntensityStartAndEndDate,

    getBMP180_airPressure,
    getBMP180_airPressureStartAndEndDate,

    getDS18B20_heaterTemperature,
    getDS18B20_heaterTemperatureStartAndEndDate,

    getDS18B20_temperature,
    getDS18B20_temperatureStartAndEndDate,

    getMoveIndicator,
    getMoveIndicatorStartAndEndDate,

    getBMP180_temperature,
    getBMP180_temperatureStartAndEndDate
}

export default labService