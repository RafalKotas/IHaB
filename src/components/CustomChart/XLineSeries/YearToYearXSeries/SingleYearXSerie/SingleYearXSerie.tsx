// redux-store
import { AppState } from "../../../../../store"
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"

import { LineSeries } from "react-jsx-highstock"
import React, { useEffect, useState } from "react"
import { AddYearData, AddYearSerie, dateInterval, resultsHandlerType } from "../../../../../store/charts"
import { getNumberAndFetchFunctions } from "../../../../../functions/parseFunctions"
import { labelWithData, periodData, stringParamFetchYearIntervalBound } from "../../../../utils/data-helpers"
import dayjs, { Dayjs } from "dayjs"
import { isYearIntervalTimeInFuture } from "../../../../../store/charts/selectors"

interface OwnSingleYearXSerieProps {
    chartId: string,
    serieName: string,
    year: string,
    interval: dateInterval
}

const mapStateToProps = (state: AppState, ownProps: OwnSingleYearXSerieProps) => ({
    chartDetails: state.chartsReducer.charts[ownProps.chartId],
    fetchingData: state.chartsReducer.charts[ownProps.chartId].yearToYear.fetchingData,
    fetchDataTriggered: state.chartsReducer.charts[ownProps.chartId].yearToYear.fetchDataTriggered,
    realTime: state.chartsReducer.charts[ownProps.chartId].yearToYear.realTime,
    dataForYearSerie: state.chartsReducer.charts[ownProps.chartId].yearToYear.yearsData[ownProps.year]

})

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnSingleYearXSerieProps) => ({
    passFetchedYearDataToStore: (data: periodData) => dispatch(AddYearSerie(ownProps.chartId, data)),
    addYearData: (data: periodData) => dispatch(AddYearData(ownProps.chartId, data))
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type SingleYearXSeriePropsFromRedux = ConnectedProps<typeof connector>

type SingleYearXSerieProps = SingleYearXSeriePropsFromRedux & OwnSingleYearXSerieProps

const SingleYearXSerie: React.FC<SingleYearXSerieProps> = ({ serieName, chartDetails, fetchDataTriggered, year,
    interval, realTime, dataForYearSerie, passFetchedYearDataToStore, addYearData }) => {

    const [resultsHandler] = useState<resultsHandlerType>(getNumberAndFetchFunctions(chartDetails.chartDataSource))

    let { start, end } = interval

    let intervalId: NodeJS.Timer | null = null

    const getLastTimeFetch = () => {
        if (dataForYearSerie && dataForYearSerie.length > 0) {
            return dayjs(new Date(dataForYearSerie[dataForYearSerie.length - 1][0]))
        } else {
            let now = new Date()
            return dayjs(now)
        }
    }

    const [lastTimeFetch, setLastTimeFetch] = useState<Dayjs>(getLastTimeFetch())

    useEffect(() => {
        if (resultsHandler) {
            if (start && end && fetchDataTriggered) {
                resultsHandler.getResultsBetweenDates(stringParamFetchYearIntervalBound(year, start),
                    stringParamFetchYearIntervalBound(year, end)).then((res) => {
                        //updateDataToGivenYear Write Some Action
                        let entries = res.data.feeds

                        let fieldNo = resultsHandler.fieldNo

                        let yearLabelWithData = labelWithData(serieName, entries, fieldNo)
                        passFetchedYearDataToStore(yearLabelWithData)
                    })
            }
        }
        //eslint-disable-next-line
    }, [fetchDataTriggered])

    // check if end day is in the future
    useEffect(() => {

        if (realTime && isYearIntervalTimeInFuture(year, interval.end)) {
            if (!intervalId) {
                intervalId = setInterval(() => {
                    let startDateParam = stringParamFetchYearIntervalBound(year, dayjs(lastTimeFetch))
                    let endDateParam = stringParamFetchYearIntervalBound(year, dayjs(lastTimeFetch).add(15000, "milliseconds"))
                    if (resultsHandler) {
                        resultsHandler.getResultsBetweenDates(startDateParam, endDateParam).then((res) => {
                            let entries = res.data.feeds
                            let fieldNo = resultsHandler.fieldNo
                            console.log(entries)
                            if (entries.length > 0) {
                                let yearLabelWithData = labelWithData(serieName, entries, fieldNo)
                                console.log(yearLabelWithData)
                                addYearData(yearLabelWithData)
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

    // function needed to put all points in same day interval (unify day, difference data)
    const mapDataForYearSerie = () => {

        if (dataForYearSerie && dataForYearSerie.length > 0) {
            return dataForYearSerie.map(([dateInMillis, value]) => {
                let dayjsFromMillis = dayjs(dateInMillis)
                //hours and minutes ok

                dayjsFromMillis = dayjsFromMillis.set("hours", dayjsFromMillis.get("hour") + 1)
                return [dayjsFromMillis.valueOf(), value]
            })
        } else {
            return []
        }
    }

    return (
        <LineSeries connectNulls={true} name={serieName} data={mapDataForYearSerie()} />
    )
}

export default connector(SingleYearXSerie)