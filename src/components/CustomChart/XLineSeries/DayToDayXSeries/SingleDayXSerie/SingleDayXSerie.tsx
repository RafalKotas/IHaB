// redux-store
import { AppState } from "../../../../../store"
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"

import { LineSeries } from "react-jsx-highstock"
import React, { useEffect, useState } from "react"
import { AddDayData, AddDaySerie, dateInterval, resultsHandlerType } from "../../../../../store/charts"
import { getNumberAndFetchFunctions } from "../../../../../functions/parseFunctions"
import dayjs, { Dayjs } from "dayjs"
import { labelWithData, periodData, stringParamFetchDay, stringParamFromDayjs } from "../../../../utils/data-helpers"
import { earliestDayFromSelected, isDayIntervalTimeInFuture } from "../../../../../store/charts/selectors"

interface OwnSingleDayXSerieProps {
    chartId: string,
    serieName: string,
    day: Dayjs,
    interval: dateInterval
}

const mapStateToProps = (state: AppState, ownProps: OwnSingleDayXSerieProps) => ({
    chartDataSource: state.chartsReducer.charts[ownProps.chartId].chartDataSource,
    fetchingData: state.chartsReducer.charts[ownProps.chartId].dayToDay.fetchingData,
    dayDataValid: state.chartsReducer.charts[ownProps.chartId].dayToDay.dataValid,
    fetchDataTriggered: state.chartsReducer.charts[ownProps.chartId].dayToDay.fetchDataTriggered,
    realTime: state.chartsReducer.charts[ownProps.chartId].dayToDay.realTime,
    selectedInterval: state.chartsReducer.charts[ownProps.chartId].dayToDay.selectedInterval,
    earliestDay: earliestDayFromSelected(state.chartsReducer, ownProps.chartId),
    dataForDaySerie: state.chartsReducer.charts[ownProps.chartId].dayToDay.daysData[ownProps.serieName]
})

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnSingleDayXSerieProps) => ({
    passFetchedDayDataToStore: (data: periodData) => dispatch(AddDaySerie(ownProps.chartId, data)),
    addDayData: (data: periodData) => dispatch(AddDayData(ownProps.chartId, data))
})

const connector = connect(mapStateToProps, mapDispatchToProps)
  
type SingleDayXSeriePropsFromRedux = ConnectedProps<typeof connector>
  
type SingleDayXSerieProps = SingleDayXSeriePropsFromRedux & OwnSingleDayXSerieProps

const SingleDayXSerie : React.FC<SingleDayXSerieProps> = ({serieName, interval, day, chartDataSource, 
    fetchDataTriggered, realTime, earliestDay , dataForDaySerie, passFetchedDayDataToStore, addDayData}) => {

    let {start, end} = interval

    console.log(interval)

    let intervalId: NodeJS.Timer | null = null

    const [resultsHandler] = useState<resultsHandlerType>(getNumberAndFetchFunctions(chartDataSource))

    const getLastTimeFetch = () => {
        if(dataForDaySerie && dataForDaySerie.length > 0) {
            return dayjs(new Date(dataForDaySerie[dataForDaySerie.length - 1][0]))
        } else {
            return dayjs( new Date()).hour(dayjs(new Date()).get("hour") - 1)
        }
    }

    const [lastTimeFetch, setLastTimeFetch] = useState<Dayjs>( getLastTimeFetch() )

    useEffect(() => {
        if(resultsHandler && fetchDataTriggered) {
            if(start && end) {
                resultsHandler.getResultsBetweenDates(stringParamFetchDay(day, start), stringParamFetchDay(day, end)).then((res) => {
                    let entries = res.data.feeds

                    console.log("past entries: ")
                    console.log(entries)

                    let fieldNo = resultsHandler.fieldNo

                    let dayLabelWithData = labelWithData(serieName, entries, fieldNo)
                    passFetchedDayDataToStore(dayLabelWithData)
                })
            }
        }

        //eslint-disable-next-line
    }, [fetchDataTriggered])


    // check if end day is in the future
    useEffect(() => {

        if(realTime && isDayIntervalTimeInFuture(day, interval.end)) {
            if(!intervalId) {
                intervalId = setInterval(() => {
                    let startDateParam = stringParamFromDayjs(dayjs(lastTimeFetch))
                    let endDateParam = stringParamFromDayjs(dayjs(lastTimeFetch).add(15000, "milliseconds"))
                    if(resultsHandler) {
                        resultsHandler.getResultsBetweenDates(startDateParam, endDateParam).then((res) => {
                            let entries = res.data.feeds
                            let fieldNo = resultsHandler.fieldNo
                            if(entries.length > 0) {
                                let dayLabelWithData = labelWithData(serieName, entries, fieldNo)
                                console.log(dayLabelWithData)
                                addDayData(dayLabelWithData)
                            }
                            //passFetchedDayDataToStore(dayLabelWithData)
                        })
                    }
                    setLastTimeFetch((lastTime) => {
                        return dayjs(lastTime).add(15000, "milliseconds")
                    })
                }, 15000)
            }
        }
        return () => {
            if(intervalId) {
                clearInterval(intervalId)
            }
        }
        //eslint-disable-next-line
    }, [realTime, lastTimeFetch])

    // function needed to put all points in same day interval (unify day, difference data)
    const mapDataForDaySerieToEarliestDay = () => {

        if(dataForDaySerie && dataForDaySerie.length > 0) {
            return dataForDaySerie.map(([dateInMillis, value]) => {
                let dayjsFromMillis = dayjs(dateInMillis)
                //hours and minutes ok
                dayjsFromMillis = dayjsFromMillis.set("year", earliestDay.get("year"))
                dayjsFromMillis = dayjsFromMillis.set("month", earliestDay.get("month") )
                dayjsFromMillis = dayjsFromMillis.set("date", earliestDay.get("date") )

                dayjsFromMillis = dayjsFromMillis.set("hours", dayjsFromMillis.get("hour") + 1 )
                return [dayjsFromMillis.valueOf(), value]
            })
        } else {
            return []
        }
    }

    return (
        <LineSeries connectNulls={true} name={serieName} data={mapDataForDaySerieToEarliestDay()} />
    )
}

export default connector(SingleDayXSerie)