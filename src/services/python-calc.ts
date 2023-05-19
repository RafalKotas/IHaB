import axios from "axios"

const PYTHON_API_URL = (drybulbtemp : number | string, radiantemp : number | string, relhum : number | string, airvel : number | string, met : number | string, clo : number | string) => 
`http://localhost:5000/climateComfort/drybulbtemp=${drybulbtemp}&radianttemp=${radiantemp}&relhum=${relhum}&airvel=${airvel}&met=${met}&clo=${clo}`

interface requestConfig {
    method: "GET",
    url? : string
}

const basicConfig : requestConfig = {
    method: "GET"
}

//date part in format like '?start=2022-11-11 10:10:10&end=2022-11-11 10:20:10'

const getPMVandPPD = (temperature : number | string, radianttemp : number | string, relativeHumidity : number | string, airVelocity : number | string,
     metabolism : number | string, clo : number | string) => {
    let config = basicConfig
    config.url = PYTHON_API_URL(temperature, radianttemp, relativeHumidity, airVelocity, metabolism, clo)

    return axios(config)    
}

const pythonCalcService = {
    getPMVandPPD
}

export default pythonCalcService