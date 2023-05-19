// react
import React from "react"

// redux
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { AppState } from "../../../../../store"

// mui
import { styled } from "@mui/material/styles"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import { getDayFirstProbe, getDayLastProbe, getDayNullProbeCount } from "../../../../../store/charts/selectors"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
    [`&.${tableCellClasses.root}`]: {
      padding: 5,
    },
  }))

interface OwnDayGeneralStatProps {
    chartId: string,
    dayStr: string,
    statName: string
}

const mapStateToProps = (state: AppState, ownProps: OwnDayGeneralStatProps) => ({
    dataForDaySerie: state.chartsReducer.charts[ownProps.chartId].dayToDay.daysData[ownProps.dayStr],
    probeCount: state.chartsReducer.charts[ownProps.chartId].dayToDay.daysData[ownProps.dayStr].length,
    nullProbeCount: getDayNullProbeCount(state.chartsReducer, ownProps.chartId, ownProps.dayStr),
    dayFirstProbe: getDayFirstProbe(state.chartsReducer, ownProps.chartId, ownProps.dayStr),
    dayLastProbe: getDayLastProbe(state.chartsReducer, ownProps.chartId, ownProps.dayStr)
})

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnDayGeneralStatProps) => ({

})

const connector = connect(mapStateToProps, mapDispatchToProps)
  
type DayGeneralStatPropsFromRedux = ConnectedProps<typeof connector>
  
type DayGeneralStatProps = DayGeneralStatPropsFromRedux & OwnDayGeneralStatProps

const DayGeneralStat : React.FC<DayGeneralStatProps> = ({statName, probeCount, nullProbeCount, 
  dayFirstProbe, dayLastProbe}) => {

    const returnDesiredValue = () => {
      switch (statName) {
        case "Probe Count":
          return probeCount
        case "Null Probe Count":
          return nullProbeCount
        case "First Not Null Probe":
          return dayFirstProbe
        case "Last Not Null Probe":
          return dayLastProbe
        default :
          return "unknown stat"
      }
    }

    return (
        <StyledTableCell style={{fontSize: 12}} align="right">{returnDesiredValue()}</StyledTableCell>
    )
}

export default connector(DayGeneralStat)