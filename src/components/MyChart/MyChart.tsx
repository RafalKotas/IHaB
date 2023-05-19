//react
import { useEffect, useState } from "react"

//style
import "./Chart.css"

//highcharts
import {
  HighchartsChart, Chart, XAxis, YAxis, Title, Subtitle, Tooltip, Legend, LineSeries, withHighcharts
} from "react-jsx-highcharts"

//own functions
import { getNumberAndFetchFunctions } from "../../functions/parseFunctions"
import Highcharts from "highcharts"


interface ChartProps {
    propertyName : string,
    filterFunction : (arr : any[], mod : number) => any[]
}

type fieldValue = null | undefined | string

interface Entry {
    created_at: string,
    field1?: fieldValue,
    field2?: fieldValue,
    field3?: fieldValue,
    field4?: fieldValue,
    field5?: fieldValue,
    field6?: fieldValue,
    field7?: fieldValue,
    field8?: fieldValue,
    field9?: fieldValue,
}

// //date part in format like 'start=2022-11-11 10:10:10&end=2022-11-11 11:11:11'

const arrAvg = (arr : number[]) => {
    const sum = arr.reduce((a, b) => a + b, 0)
    const avg = (sum / arr.length) || 0

    return avg
}

const MyChart : React.FC<ChartProps> = ({propertyName, filterFunction} /*props: HighchartsReact.Props*/ ) => {



    const [dateStamps, setDateStamps] = useState<string[]>([])
     
    const [values, setValues] = useState<number[]>([])

    const probeMultiple = 5

    const resultsHandler = getNumberAndFetchFunctions(propertyName)

    const yAxisTitle = ( resultsHandler && resultsHandler.propertyName && resultsHandler.suffix) ? (resultsHandler.propertyName + resultsHandler.suffix) : "unknown"

    useEffect(() => {
        let handlerNo = resultsHandler?.fieldNo
        resultsHandler?.getResultsBetweenDates("2022-11-11 10:00:00", "2022-11-11 22:00:00")
        .then(res => {
            let entries : Entry[] = res.data.feeds
            console.log(entries)
            let dates = entries.map((entry : Entry) => {return entry["created_at"]})
            
            let entryFieldKey = ("field" + handlerNo) as keyof Entry
            
            let values = entries.map((entry : Entry) => {return entry[entryFieldKey]})

            let valuesNotNull = values.reduce((previousValue, currentValue/*, currentIndex, array*/) => {
                return currentValue ? [...previousValue, parseFloat(currentValue)] : previousValue
            }, [] as number[])

            let meanResultValue = arrAvg(valuesNotNull)
            
            let valuesNullsAfterReplaced = entries.map((entry : Entry, index, entryArr) => {
                let entryBasic = entry[entryFieldKey]
                if(!entryBasic && index > 0 && entryArr[index - 1][entryFieldKey]) {
                    let entryNullReplaced = entryArr[ index - 1][entryFieldKey]
                    entryBasic = entryNullReplaced
                }
                return entryBasic ? parseFloat( entryBasic.toString().replace(/[\r\n]/g, "") ) : meanResultValue/*null*/
            })

            //TODO? - parse Data to better format

            setDateStamps(dates)
            setValues(valuesNullsAfterReplaced)
        })

        //eslint-disable-next-line
    }, [])

    console.log(resultsHandler)

    return (
        <div>
                <div className="chart-options-area">
                    <HighchartsChart styledMode>
                        <Chart scrollablePlotArea={{
                            minWidth: 500
                        }}/>
                    
                        <Title>{propertyName + " , fieldNo: " + resultsHandler?.fieldNo}</Title>
                    
                        <Subtitle> Source: https://thingspeak.com/channels/202842 (PUT lab. L.2.7.14BT) </Subtitle>
                    
                        <Legend layout="horizontal" align="right" verticalAlign="middle" borderWidth={0} />
                    
                        <Tooltip valueSuffix={resultsHandler?.suffix} shared />
                    
                        <XAxis type="datetime" categories={filterFunction(dateStamps, probeMultiple)} scrollbar={{enabled: true}}>
                            <XAxis.Title>Time</XAxis.Title>
                        </XAxis>
                    
                        <YAxis
                            min={Math.min(...values)}
                            max={Math.max(...values)} 
                            minorTickInterval={0.1}
                            tickInterval={1}
                        >
                            <YAxis.Title>{yAxisTitle}</YAxis.Title>
                            <LineSeries 
                                marker={{
                                    enabled: true
                                }} 
                                name={propertyName} 
                                data={filterFunction(values, probeMultiple)}
                                dataLabels={{
                                    enabled: true,
                                    inside: true
                                }}
                            />
                        </YAxis>
                    </HighchartsChart>
                </div>
        </div>
    )
}

export default withHighcharts(MyChart, Highcharts)