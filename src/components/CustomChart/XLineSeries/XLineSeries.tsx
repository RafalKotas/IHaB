// redux-store
import { AppState } from "../../../store"
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"

// react
import React from "react"

// components
import YearToYearXSeries from "./YearToYearXSeries/YearToYearXSeries"
import DayToDayXSeries from "./DayToDayXSeries/DayToDayXSeries"
import HourToHourXSeries from "./HourToHourXSeries/HourToHourXSeries"


interface OwnXLineSeriesProps {
    chartId: string
}

const mapStateToProps = (state: AppState, ownProps: OwnXLineSeriesProps) => ({
    chartDetails: state.chartsReducer.charts[ownProps.chartId]
})

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnXLineSeriesProps) => ({

})

const connector = connect(mapStateToProps, mapDispatchToProps)
  
type XLineSeriesPropsFromRedux = ConnectedProps<typeof connector>
  
type XLineSeriesProps = XLineSeriesPropsFromRedux & OwnXLineSeriesProps

const XLineSeries: React.FC<XLineSeriesProps> = ({chartId, chartDetails }) => {

    let chartType = chartDetails.chartTypeSelected

    const returnProperXSeriesComponent = () => {
        switch (chartType) {
            case "Year to year":
                return <YearToYearXSeries chartId={chartId}/>
            case "Day to day":
                return <DayToDayXSeries chartId={chartId}/>
            case "Hour to hour":
                return <HourToHourXSeries chartId={chartId}/>
        }
    }

    return (
        <React.Fragment>
            {
                returnProperXSeriesComponent()
            }
        </React.Fragment>
    )
}

export default connector(XLineSeries)