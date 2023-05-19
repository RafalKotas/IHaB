//services
import labService from "../services/lab2-7-14endpoints"

export const getNumberAndFetchFunctions = (propertyName : string) => {
    switch (propertyName) {
        case "DHT22_temperature":
            let DHT22_temperatureHandler = {
                propertyName: "temperature",
                getLatestResults : labService.getDHT22_temperature,
                getResultsBetweenDates : labService.getDHT22_temperatureStartAndEndDate,
                suffix: " °C",
                fieldNo: 1
            }
            return DHT22_temperatureHandler
        case "DHT22_relativeHumidity":
            let DHT22_relativeHumidityHandler = {
                propertyName: "humidity",
                getLatestResults : labService.getDHT22_relativeHumidity,
                getResultsBetweenDates : labService.getDHT22_relativeHumidityStartAndEndDate,
                suffix: " %",
                fieldNo: 2
            }
            return DHT22_relativeHumidityHandler
        case "BH1750_lightIntensity":
            let BH1750_lightIntensityHandler = {
                propertyName: "light intensity",
                getLatestResults : labService.getBH1750_lightIntensity,
                getResultsBetweenDates : labService.getBH1750_lightIntensityStartAndEndDate,
                suffix: " lux",
                fieldNo: 3
            }
            return BH1750_lightIntensityHandler
        case "BMP180_airPressure":
            let BMP180_airPressureHandler = {
                propertyName: "air pressure",
                getLatestResults : labService.getBMP180_airPressure,
                getResultsBetweenDates : labService.getBMP180_airPressureStartAndEndDate,
                suffix: " hPa",
                fieldNo: 4
            }
            return BMP180_airPressureHandler
        case "DS18B20_heaterTemperature":
            let DS18B20_heaterTemperatureHandler = {
                propertyName: "temperature",
                getLatestResults : labService.getDS18B20_heaterTemperature,
                getResultsBetweenDates : labService.getDS18B20_heaterTemperatureStartAndEndDate,
                suffix: " °C",
                fieldNo: 5
            }
            return DS18B20_heaterTemperatureHandler
        case "DS18B20_temperature":
            let DS18B20_temperatureHandler = {
                propertyName: "temperature",
                getLatestResults : labService.getDS18B20_temperature,
                getResultsBetweenDates : labService.getDS18B20_temperatureStartAndEndDate,
                suffix: " °C",
                fieldNo: 6
            }
            return DS18B20_temperatureHandler
        case "MoveIndicator":
            let MoveIndicatorHandler = {
                propertyName: "move(Y/N)",
                getLatestResults : labService.getMoveIndicator,
                getResultsBetweenDates : labService.getMoveIndicatorStartAndEndDate,
                suffix: "",
                fieldNo: 7
            }
            return MoveIndicatorHandler
        case "BMP180_temperature":
            let BMP180_temperatureHandler = {
                propertyName: "temperature",
                getLatestResults : labService.getBMP180_temperature,
                getResultsBetweenDates : labService.getBMP180_temperatureStartAndEndDate,
                suffix: " °C",
                fieldNo: 8
            }
            return BMP180_temperatureHandler
        default:
          console.log("Not supported device!")
          return null
    }
}