// react
import React from "react"

// redux
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { AppState } from "../../../../../store"

// mui
import { styled } from "@mui/material/styles"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import { getYearFirstProbe, getYearLastProbe, getYearNullProbeCount } from "../../../../../store/charts/selectors"

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

interface OwnYearGeneralStatProps {
    chartId: string,
    year: string,
    statName: string
}

const mapStateToProps = (state: AppState, ownProps: OwnYearGeneralStatProps) => ({
    dataForYearSerie: state.chartsReducer.charts[ownProps.chartId].yearToYear.yearsData[ownProps.year],
    probeCount: state.chartsReducer.charts[ownProps.chartId].yearToYear.yearsData[ownProps.year].length,
    nullProbeCount: getYearNullProbeCount(state.chartsReducer, ownProps.chartId, ownProps.year),
    yearFirstProbe: getYearFirstProbe(state.chartsReducer, ownProps.chartId, ownProps.year),
    yearLastProbe: getYearLastProbe(state.chartsReducer, ownProps.chartId, ownProps.year)
})

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnYearGeneralStatProps) => ({

})

const connector = connect(mapStateToProps, mapDispatchToProps)
  
type YearGeneralStatPropsFromRedux = ConnectedProps<typeof connector>
  
type YearGeneralStatProps = YearGeneralStatPropsFromRedux & OwnYearGeneralStatProps

const YearGeneralStat : React.FC<YearGeneralStatProps> = ({statName, probeCount, nullProbeCount, 
  yearFirstProbe, yearLastProbe}) => {

    const returnDesiredValue = () => {
      switch (statName) {
        case "Probe Count":
          return probeCount
        case "Null Probe Count":
          return nullProbeCount
        case "First Probe":
          return yearFirstProbe
        case "Last Probe":
          return yearLastProbe
        default :
          return "unknown stat"
      }
    }

    return (
        <StyledTableCell style={{fontSize: 12}} align="right">{returnDesiredValue()}</StyledTableCell>
    )
}

export default connector(YearGeneralStat)