// redux-store
import { AppState } from "../../../../store"
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"

import React from "react"
import SingleYearXSerie from "./SingleYearXSerie/SingleYearXSerie"

interface OwnYearToYearXLineSeriesProps {
    chartId: string
}

const mapStateToProps = (state: AppState, ownProps: OwnYearToYearXLineSeriesProps) => ({
    chartDetails: state.chartsReducer.charts[ownProps.chartId],
    fetchingData: state.chartsReducer.charts[ownProps.chartId].yearToYear.fetchingData,
    realTime: state.chartsReducer.charts[ownProps.chartId].yearToYear.realTime,
    selectedInterval: state.chartsReducer.charts[ownProps.chartId].yearToYear.selectedInterval,
    selectedYears: state.chartsReducer.charts[ownProps.chartId].yearToYear.selectedYears

})

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnYearToYearXLineSeriesProps) => ({
    
})

const connector = connect(mapStateToProps, mapDispatchToProps)
  
type YearToYearXLineSeriesPropsFromRedux = ConnectedProps<typeof connector>
  
type YearToYearXLineSeriesProps = YearToYearXLineSeriesPropsFromRedux & OwnYearToYearXLineSeriesProps

const YearToYearXSeries : React.FC<YearToYearXLineSeriesProps> = ({chartId, selectedYears, selectedInterval}) => {

    return (
        <React.Fragment>
            {selectedYears.map((selectedYear, index) => {
                return <SingleYearXSerie year={selectedYear} interval={selectedInterval} serieName={selectedYear} chartId={chartId} />
            })}
        </React.Fragment>
    )
}

export default connector(YearToYearXSeries)