// redux-store
import { AppState } from "../../../../store"
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"

import React from "react"

import SingleDayXSerie from "./SingleDayXSerie/SingleDayXSerie"
import { dayjsDayToDateString } from "../../../utils/data-helpers"

interface OwnDayToDayXLineSeriesProps {
    chartId: string
}

const mapStateToProps = (state: AppState, ownProps: OwnDayToDayXLineSeriesProps) => ({
    chartDetails: state.chartsReducer.charts[ownProps.chartId],
    fetchingData: state.chartsReducer.charts[ownProps.chartId].dayToDay.fetchingData,
    realTime: state.chartsReducer.charts[ownProps.chartId].dayToDay.realTime,
    selectedInterval: state.chartsReducer.charts[ownProps.chartId].dayToDay.selectedInterval,
    selectedDays: state.chartsReducer.charts[ownProps.chartId].dayToDay.selectedDays

})

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnDayToDayXLineSeriesProps) => ({
})

const connector = connect(mapStateToProps, mapDispatchToProps)
  
type DayToDayXLineSeriesPropsFromRedux = ConnectedProps<typeof connector>
  
type DayToDayXLineSeriesProps = DayToDayXLineSeriesPropsFromRedux & OwnDayToDayXLineSeriesProps

const DayToDayXLineSeries : React.FC<DayToDayXLineSeriesProps> = ({chartId, selectedInterval, selectedDays}) => {

    return (
        <React.Fragment>
            {selectedDays.map((day, index) => {
                return <SingleDayXSerie day={day} interval={selectedInterval} serieName={ dayjsDayToDateString(day)} chartId={chartId} />
            })}
        </React.Fragment>
    )
}

export default connector(DayToDayXLineSeries)