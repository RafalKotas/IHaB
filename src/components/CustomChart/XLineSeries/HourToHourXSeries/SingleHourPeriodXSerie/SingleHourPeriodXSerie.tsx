// redux-store
import { AppState } from "../../../../../store"
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"

import { LineSeries } from "react-jsx-highstock"
import React, { useEffect, useState } from "react"
import { AddHourPeriodData, AddHourPeriodSerie, dateInterval, resultsHandlerType } from "../../../../../store/charts"
import { getNumberAndFetchFunctions } from "../../../../../functions/parseFunctions"
import { labelWithData, periodData, stringParamFetchDay, stringParamFromDayjs } from "../../../../utils/data-helpers"
import { dayWithEarliestHourPeriodStartFromSelected, isHourPeriodInFuture } from "../../../../../store/charts/selectors"
import dayjs, { Dayjs } from "dayjs"

interface OwnSingleHourPeriodXSerieProps {
    chartId: string,
    serieName: string,
    period: dateInterval
}

const mapStateToProps = (state: AppState, ownProps: OwnSingleHourPeriodXSerieProps) => ({
    chartDetails: state.chartsReducer.charts[ownProps.chartId],
    fetchingData: state.chartsReducer.charts[ownProps.chartId].hourToHour.fetchingData,
    fetchDataTriggered: state.chartsReducer.charts[ownProps.chartId].hourToHour.fetchDataTriggered,
    realTime: state.chartsReducer.charts[ownProps.chartId].hourToHour.realTime,
    dayWithEarliestHourPeriodStart: dayWithEarliestHourPeriodStartFromSelected(state.chartsReducer, ownProps.chartId),
    selectedPeriods: state.chartsReducer.charts[ownProps.chartId].hourToHour.selectedPeriods,
    dataForHourPeriodSerie: state.chartsReducer.charts[ownProps.chartId].hourToHour.hourPeriodsData[ownProps.serieName]

})

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnSingleHourPeriodXSerieProps) => ({
    passFetchedHourPeriodDataToStore: (data: periodData) => dispatch(AddHourPeriodSerie(ownProps.chartId, data)),
    addHourPeriodData: (data: periodData) => dispatch(AddHourPeriodData(ownProps.chartId, data))
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type SingleHourPeriodXSeriePropsFromRedux = ConnectedProps<typeof connector>

type SingleHourPeriodXSerieProps = SingleHourPeriodXSeriePropsFromRedux & OwnSingleHourPeriodXSerieProps

const SingleHourPeriodXSerie: React.FC<SingleHourPeriodXSerieProps> = ({ period, serieName, chartDetails, fetchDataTriggered,
    realTime, dayWithEarliestHourPeriodStart, dataForHourPeriodSerie, passFetchedHourPeriodDataToStore, addHourPeriodData }) => {

    console.log(period)

    const [resultsHandler] = useState<resultsHandlerType>(getNumberAndFetchFunctions(chartDetails.chartDataSource))

    let { start, end } = period

    let intervalId: NodeJS.Timer | null = null

    const getLastTimeFetch = () => {
        return (dataForHourPeriodSerie && dataForHourPeriodSerie.length > 0) ? 
            dayjs(new Date(dataForHourPeriodSerie[dataForHourPeriodSerie.length - 1][0])) : dayjs( new Date()).hour(dayjs(new Date()).get("hour") - 1)
    }

    const [lastTimeFetch, setLastTimeFetch] = useState<Dayjs>(getLastTimeFetch())

    useEffect(() => {
        if (resultsHandler && fetchDataTriggered) {
            console.log(start)
            console.log(end)
            resultsHandler.getResultsBetweenDates(stringParamFetchDay(start, start),
                stringParamFetchDay(end, end)).then((res) => {
                    let entries = res.data.feeds

                    let fieldNo = resultsHandler.fieldNo

                    let hourPeriodLabelWithData = labelWithData(serieName, entries, fieldNo)
                    passFetchedHourPeriodDataToStore(hourPeriodLabelWithData)
                })
        }

        //eslint-disable-next-line
    }, [fetchDataTriggered])

    // check if end day is in the future
    useEffect(() => {

        if (realTime && isHourPeriodInFuture(period)) {
            if (!intervalId) {
                intervalId = setInterval(() => {
                    let startDateParam = stringParamFromDayjs(lastTimeFetch)
                    let endDateParam = stringParamFromDayjs((lastTimeFetch).add(15000, "milliseconds"))
                    if (resultsHandler) {
                        resultsHandler.getResultsBetweenDates(startDateParam, endDateParam).then((res) => {
                            let entries = res.data.feeds
                            let fieldNo = resultsHandler.fieldNo
                            console.log(entries)
                            if (entries.length > 0) {
                                let dayLabelWithData = labelWithData(serieName, entries, fieldNo)
                                console.log(dayLabelWithData)
                                addHourPeriodData(dayLabelWithData)
                            }
                        })
                    }
                    setLastTimeFetch((lastTime) => {
                        return dayjs(lastTime).add(15000, "milliseconds")
                    })
                }, 15000)
            }
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
        //eslint-disable-next-line
    }, [realTime, lastTimeFetch])

    const mapDataForHourPeriodSerieToEarliestHourStartPeriod = () => {

        if (dataForHourPeriodSerie && dataForHourPeriodSerie.length > 0 && start && end) {
            // millis diference between earliest and current intervals
            let timeDiff = start.valueOf() - dayWithEarliestHourPeriodStart.valueOf()
            let hoursInMillis = 60 * 60 * 1000
            return dataForHourPeriodSerie.map(([dateInMillis, value], index) => {
                return [dateInMillis - timeDiff + hoursInMillis, value]
            })
        } else {
            return []
        }
    }

    return (
        <LineSeries connectNulls={true} name={serieName} data={mapDataForHourPeriodSerieToEarliestHourStartPeriod()} />
    )
}

export default connector(SingleHourPeriodXSerie)