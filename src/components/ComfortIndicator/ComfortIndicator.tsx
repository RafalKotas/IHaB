import React, { useEffect, useState } from "react"

import dayjs, { Dayjs } from "dayjs"

import pythonCalcService from "../../services/python-calc"
import labService from "../../services/lab2-7-14endpoints"

import "./ComfortIndicator.css"
import { stringParamFromDayjs } from "../utils/data-helpers"
import axios from "axios"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck, faCircleXmark, faDroplet, faFaceFrown, faFaceFrownOpen, faSadCry, faSquarePollVertical, faTemperatureHalf, IconDefinition } from "@fortawesome/free-solid-svg-icons"

import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import { styled } from "@mui/material/styles"
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import MetabolismSection, { metabolicRates, metabolicRatesKeys } from "./MetabolismSection/MetabolismSection"
import CloRateSection, { cloRates, cloRatesKeys } from "./CloRateSection/CloRateSection"

interface dataStructure {
    temperature: number,
    humidity: number
}

const ComfortIndicator = () => {

    let intervalId: NodeJS.Timer | null = null

    const [source, setSource] = useState<string>("generator")

    const [fetchFromThingSpeak, setFetchFromThingSpeak] = useState<boolean>(true)

    const [lastTimeFetch, setLastTimeFetch] = useState<Dayjs>( dayjs( new Date()).hour(dayjs(new Date()).get("hour") - 1) )

    const baseTemp = 18
    const baseRelativeHumidity = 28

    //data from thingspeak
    const [stateDataFromThingSpeak, setStateDataFromThingSpeak] = useState<dataStructure>({
        temperature: baseTemp,
        humidity: baseRelativeHumidity
    })
    //data from generator
    const [stateDataFromGenerator, setStateDataFromGenerator] = useState<dataStructure>({
        temperature: baseTemp,
        humidity: baseRelativeHumidity
    })

    const [meanRadiantTemperature, setMeanRadiantTemperature] = useState<number>(25.0)
    const [airVelocity, setAirVelocity] = useState<number>(0.1)
    
    const [metabolicProduction, setMetabolicProduction] = useState<metabolicRatesKeys>("SEATED, QUIET")
    const [clothingLevel, setClothingLevel] = useState<cloRatesKeys>("Typical winter indoor clothing")

    //indicators
    const [PMV, setPMV] = useState<number>(-0.15)
    const [PPD, setPPD] = useState<number>(5)

    useEffect(() => {
        //airTemperature, radiantTemperature, relativeHumidity, airVelocitty, metabolicProduction, clothingLevel
        pythonCalcSelfGenerated()

    }, [stateDataFromGenerator.humidity, stateDataFromGenerator.temperature, metabolicProduction, clothingLevel])

    const pythonCalcSelfGenerated = () => {
        console.log(metabolicProduction)
        pythonCalcService.getPMVandPPD(stateDataFromGenerator.temperature.toFixed(1), meanRadiantTemperature.toFixed(1), 
        stateDataFromGenerator.humidity.toFixed(1), 
                airVelocity.toFixed(1), metabolicRates[metabolicProduction].toFixed(1), cloRates[clothingLevel].toFixed(1)).then((res) => {
            setPMV(res.data.pmv)
            setPPD(res.data.ppd)
        })
    }

    const pythonCalcThingspeak = () => {
        pythonCalcService.getPMVandPPD(stateDataFromThingSpeak.temperature.toFixed(1), meanRadiantTemperature.toFixed(1), 
        stateDataFromThingSpeak.humidity.toFixed(1), 
                airVelocity.toFixed(1), metabolicRates[metabolicProduction].toFixed(1), cloRates[clothingLevel].toFixed(1)).then((res) => {
            setPMV(res.data.pmv)
            setPPD(res.data.ppd)
        })
    }

    useEffect(() => {

        if(fetchFromThingSpeak) {
            if(!intervalId) {
                intervalId = setTimeout(() => {
                    console.log("last fetch time: " + lastTimeFetch)
                    let startDateParam = stringParamFromDayjs(dayjs(lastTimeFetch))
                    let endDateParam = stringParamFromDayjs(dayjs(lastTimeFetch).add(15000, "milliseconds"))
                    fetchNeededData(startDateParam, endDateParam)
                    setLastTimeFetch((lastTime) => {
                        return dayjs(lastTime).add(15000, "milliseconds")
                    })
                }, 15000)
            }
        }
        return () => {
            if(intervalId && !fetchFromThingSpeak) {
                clearTimeout(intervalId)
            }
        }
        //eslint-disable-next-line
    }, [fetchFromThingSpeak, lastTimeFetch])


    let getBoundsFromCurrentValue = (currentValue : number) => {
        let cVx10 = currentValue * 10
        let lowerBound = cVx10 - 3
        let upperBound = cVx10 + 3
        return [lowerBound, upperBound]
    }

    const randomIntFromInterval = (min : number, max : number) => { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    const fetchNeededData = (startDateParam : string, endDateParam : string) => {

        let tempBounds = getBoundsFromCurrentValue(stateDataFromGenerator.temperature)
        let humBounds = getBoundsFromCurrentValue(stateDataFromGenerator.humidity)
        const temperature20to30 = randomIntFromInterval(tempBounds[0], tempBounds[1])//axios.get(`https://www.randomnumberapi.com/api/v1.0/random?min=${tempBounds[0]}&max=${tempBounds[1]}&count=1`)
        const humidity260to280 = randomIntFromInterval(humBounds[0], humBounds[1])//axios.get(`https://www.randomnumberapi.com/api/v1.0/random?min=${humBounds[0]}&max=${humBounds[1]}&count=1`)
        const DHT22_temperature_promise = labService.getDHT22_temperatureStartAndEndDate(startDateParam, endDateParam)
        const DHT22_relative_humidity_promise = labService.getDHT22_relativeHumidityStartAndEndDate(startDateParam, endDateParam)

        let promisesThingSpeak = [DHT22_temperature_promise, DHT22_relative_humidity_promise]
        let promisesGenerator = [temperature20to30, humidity260to280]

        setStateDataFromGenerator({
            temperature: temperature20to30 / 10,
            humidity: humidity260to280 / 10
        })

        /*let promiseToFulfill = Promise.all(promisesGenerator).then(function(values) {
            console.log(values)
            return values.reduce((prevValue, currentValue, index) => {
                // self generated
                if(source === "generator") {
                    if(index === 0) {
                        return {
                            ...prevValue,
                            temperature: currentValue.data[0] / 10
                        }
                    } else {
                        return {
                            ...prevValue,
                            humidity: currentValue.data[0] / 10
                        }
                    }
                } else {
                    //ThingSpeak
                    if(currentValue.data.feeds && currentValue.data.feeds.length) {
                        if((Object.hasOwn(currentValue.data.feeds[0], "field1") && currentValue.data.feeds[0].field1 )) {
                            return {
                                ...stateDataFromThingSpeak,
                                temperature: parseFloat(currentValue.data.feeds[0].field1.toString())
                            }
                        } else if (Object.hasOwn(currentValue.data.feeds[0], "field2") && currentValue.data.feeds[0].field2 ) {
                            return {
                                ...stateDataFromThingSpeak,
                                humidity: parseFloat(currentValue.data.feeds[0].field2.toString())
                            }
                        } else {
                            return stateDataFromThingSpeak
                        }
                    } else {
                        return stateDataFromThingSpeak
                    }
                }
            }, {
                temperature: 0,
                humidity:  20
            } as dataStructure)
        }).then((results) => {
            let updatedValues = results
            if(source === "generator") {
                setStateDataFromGenerator(updatedValues)
            } else {
                setStateDataFromThingSpeak(results)
            }
        })*/
    }

    const dissatisfiedPercentFont = () => {
        let icon : IconDefinition
        let color : string
        if(PPD < 5) {
            icon = faSquarePollVertical
            color = "green"
        } else if (PPD < 10) {
            icon = faFaceFrownOpen
            color = "yellow"
        } else if (PPD < 15) {
            icon = faFaceFrown
            color = "orange"
        } else {
            icon = faSadCry
            color = "red"
        }
        return <FontAwesomeIcon color={color} className="icon-fixed-size" icon={icon}/>
    }

    const PMVScore = () => {
        if(PMV > 2.5) {
            return "HOT (3)"
        } else if(PMV > 1.5) {
            return "WARM (2)"
        } else if(PMV > 0.5) {
            return "MODERATELY WARM(1)"
        } else if (PMV > -0.5) {
            return "NEUTRAL (0)"
        } else if (PMV > -1.5) {
            return "MODERATELY CHILLY(-1)"
        } else if (PMV > -2.5) {
            return "CHILLY (-2)"
        } else {
            return "COLD (-3)"
        }
    }

    const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
      ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
          backgroundColor: "#f5f5f9",
          color: "rgba(0, 0, 0, 0.87)",
          maxWidth: 220,
          fontSize: theme.typography.pxToRem(12),
          border: "1px solid #dadde9",
        },
      }))

    const ComplianceIndicator = () => {
        let compliant = complianceCondition()
        let icon : IconDefinition = compliant ? faCircleCheck : faCircleXmark
        let color : string = compliant ? "green" : "red"
        let description :  string = compliant ? "Complies with ASHRAE Standard 55-2020." : "Not complies with ASHRAE Standard 55-2020!"
        return <HtmlTooltip
            title={
                <React.Fragment>
                    <Typography color="inherit">Compliance indicator</Typography>
                    {description}
                </React.Fragment>
            }
            >
                <FontAwesomeIcon color={color} icon={icon} /> 
            </HtmlTooltip>
    }

    const complianceCondition = () => (PMV < 0.5 && PMV > -0.5)

    const PanelCard = () => {
        return (
            <Card sx={{ minWidth: 375 }}>
                <CardContent>
                    <div id="footer-name">
                        <h3>
                            Climate comfort panel  <ComplianceIndicator />
                        </h3>
                    </div>
                    <HtmlTooltip
                        title={
                            <React.Fragment>
                                <Typography color="inherit">Predicted Mean Vote</Typography>
                                Represents one of 7 comfort levels.
                            </React.Fragment>
                        }
                    >
                        <h5 className="comfort-property">
                            <FontAwesomeIcon color="gray" className={"icon-fixed-size"} icon={faSquarePollVertical} />PMV: {PMV}
                        </h5>
                    </HtmlTooltip>
                    <HtmlTooltip
                        title={
                            <React.Fragment>
                                <Typography color="inherit">Predicted Percentage of dissatisfied people</Typography>
                                Represents how many people probably will feel uncomfortable.
                            </React.Fragment>
                        }
                    >
                        <h5 className="comfort-property">
                            {dissatisfiedPercentFont()} PPD: {PPD}
                        </h5>
                    </HtmlTooltip>
                    <h5 className="comfort-property">
                        <FontAwesomeIcon color="red" className={"icon-fixed-size"} icon={faTemperatureHalf} />  Temperature: {source === "thingspeak" ? stateDataFromThingSpeak.temperature : stateDataFromGenerator.temperature}&#8451;
                    </h5>
                    <h5 className="comfort-property">
                        <FontAwesomeIcon color="blue" className={"icon-fixed-size"} icon={faDroplet} />  Relative humidity: {source === "thingspeak" ? stateDataFromThingSpeak.humidity : stateDataFromGenerator.humidity}%
                    </h5>
                    <h5>
                        PMV SCORE: {PMVScore()}
                    </h5>
                </CardContent>
            </Card>
        )
    }

    return (
        <footer id="Comfort-footer">
            <div id="comfort-options">
                <MetabolismSection 
                    metabolicProduction={metabolicProduction} 
                    onChangeFunc={(metabolic) => setMetabolicProduction(metabolic)}
                />
                <CloRateSection 
                    cloProduction={clothingLevel} 
                    onChangeFunc={(clothing) => setClothingLevel(clothing)}                    
                />
            </div>
            <PanelCard />
        </footer>
    )
}

export default ComfortIndicator