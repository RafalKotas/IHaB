// react
import React from "react"

// redux
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { AppState } from "../../../../../store"

// mui
import { styled } from "@mui/material/styles"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import { getHourPeriodFirstProbe, getHourPeriodLastProbe, getHourPeriodNullProbeCount } from "../../../../../store/charts/selectors"

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

interface OwnHourGeneralStatProps {
    chartId: string,
    hourPeriodStr: string,
    statName: string
}

const mapStateToProps = (state: AppState, ownProps: OwnHourGeneralStatProps) => ({
    dataForHourPeriodSerie: state.chartsReducer.charts[ownProps.chartId].hourToHour.hourPeriodsData[ownProps.hourPeriodStr],
    probeCount: state.chartsReducer.charts[ownProps.chartId].hourToHour.hourPeriodsData[ownProps.hourPeriodStr].length,
    nullProbeCount: getHourPeriodNullProbeCount(state.chartsReducer, ownProps.chartId, ownProps.hourPeriodStr),
    hourPeriodFirstProbe: getHourPeriodFirstProbe(state.chartsReducer, ownProps.chartId, ownProps.hourPeriodStr),
    hourPeriodLastProbe: getHourPeriodLastProbe(state.chartsReducer, ownProps.chartId, ownProps.hourPeriodStr)
})

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnHourGeneralStatProps) => ({

})

const connector = connect(mapStateToProps, mapDispatchToProps)
  
type HourGeneralStatPropsFromRedux = ConnectedProps<typeof connector>
  
type HourGeneralStatProps = HourGeneralStatPropsFromRedux & OwnHourGeneralStatProps

const HourGeneralStat : React.FC<HourGeneralStatProps> = ({statName, probeCount, nullProbeCount, 
  hourPeriodFirstProbe, hourPeriodLastProbe}) => {

    const returnDesiredValue = () => {
      switch (statName) {
        case "Probe Count":
          return probeCount
        case "Null Probe Count":
          return nullProbeCount
        case "First Probe":
          return hourPeriodFirstProbe
        case "Last Probe":
          return hourPeriodLastProbe
        default :
          return "unknown stat"
      }
    }

    return (
        <StyledTableCell style={{fontSize: 12}} align="right">{returnDesiredValue()}</StyledTableCell>
    )
}

export default connector(HourGeneralStat)