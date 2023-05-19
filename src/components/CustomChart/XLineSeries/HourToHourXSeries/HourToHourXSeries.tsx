// redux-store
import { AppState } from "../../../../store"
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"

import React from "react"

import { periodLabel } from "../../../utils/data-helpers"
import SingleHourPeriodXSerie from "./SingleHourPeriodXSerie/SingleHourPeriodXSerie"

interface OwnHourToHourXLineSeriesProps {
    chartId: string
}

const mapStateToProps = (state: AppState, ownProps: OwnHourToHourXLineSeriesProps) => ({
    chartDetails: state.chartsReducer.charts[ownProps.chartId],
    fetchingData: state.chartsReducer.charts[ownProps.chartId].hourToHour.fetchingData,
    realTime: state.chartsReducer.charts[ownProps.chartId].hourToHour.realTime,
    selectedPeriods: state.chartsReducer.charts[ownProps.chartId].hourToHour.selectedPeriods

})

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnHourToHourXLineSeriesProps) => ({
    //passStartTimeToStore: (updatedStartTime: Dayjs) => dispatch(SetHourToHourChartStartTime(ownProps.chartId, updatedStartTime)),
})

const connector = connect(mapStateToProps, mapDispatchToProps)
  
type HourToHourXLineSeriesPropsFromRedux = ConnectedProps<typeof connector>
  
type HourToHourXLineSeriesProps = HourToHourXLineSeriesPropsFromRedux & OwnHourToHourXLineSeriesProps

const HourToHourXSeries : React.FC<HourToHourXLineSeriesProps> = ({chartId, selectedPeriods}) => {

    return (
        <React.Fragment>
            {selectedPeriods.map((selectedPeriod, index) => {
                return <SingleHourPeriodXSerie period={selectedPeriod} serieName={periodLabel(selectedPeriod)} chartId={chartId} />
            })}
        </React.Fragment>
    )
}

export default connector(HourToHourXSeries)