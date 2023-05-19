// redux
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { AppState } from "../../../../store"

// react
import * as React from "react"

// mui
import { styled } from "@mui/material/styles"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"

// components

// data helpers
import { dataAverage, dataMaximum, dataMedian, dataMinimum, dataStdDev, dataVariance, dayjsDayToDateString, periodLabel } from "../../../utils/data-helpers"
import HourStatCellWithValue from "./HourStatCellWithValue/HourStatCellWithValue"
import HourGeneralStat from "./HourGeneralStat/HourGeneralStat"

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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  },
}))

interface OwnHourPeriodStatsPanelProps {
    chartId: string
}

const mapStateToProps = (state: AppState, ownProps: OwnHourPeriodStatsPanelProps) => ({
    selectedHourPeriods: state.chartsReducer.charts[ownProps.chartId].hourToHour.selectedPeriods
})

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnHourPeriodStatsPanelProps) => ({

})

const connector = connect(mapStateToProps, mapDispatchToProps)
  
type HourPeriodStatsPanelPropsFromRedux = ConnectedProps<typeof connector>
  
type HourPeriodStatsPanelProps = HourPeriodStatsPanelPropsFromRedux & OwnHourPeriodStatsPanelProps

interface statProps {
  name: string,
  reduceFunction?: (data : number[]) => number | string,
  value? : number | string
}

const HourPeriodStatsPanel : React.FC<HourPeriodStatsPanelProps> = ({chartId, selectedHourPeriods}) => {

    const stats : statProps[] = [
      {
        name: "Mean",
        reduceFunction: (data : number[]) => dataAverage(data)
      },
      {
        name: "Median",
        reduceFunction: (data : number[]) => dataMedian(data)
      },
      {
        name: "Variance",
        reduceFunction: (data : number[]) => dataVariance(data)
      },
      {
        name: "Std Dev",
        reduceFunction: (data : number[]) => dataStdDev(data)
      },
      {
        name: "Min",
        reduceFunction: (data : number[]) => dataMinimum(data)
      },
      {
        name: "Max",
        reduceFunction: (data : number[]) => dataMaximum(data)
      },
      {
        name: "Probe Count"
      },
      {
        name: "Null Probe Count"
      },
      {
        name: "First Probe"
      },
      {
        name: "Last Probe"
      }
    ]

    return (
        <TableContainer component={Paper}>
        <Table sx={{ maxWidth: 500, maxHeight: "100%", overflowX: "scroll"}} aria-label="customized table">
          
          <TableHead>
            <TableRow>
                <StyledTableCell> 
                    Statistic
                </StyledTableCell>
                <React.Fragment>
                {
                    selectedHourPeriods.map((selectedHourPeriod) => {
                        return <StyledTableCell align="right">{periodLabel(selectedHourPeriod)}</StyledTableCell>      
                    })
                }
                </React.Fragment>
            </TableRow>
          </TableHead>

          <TableBody>
            {stats.map((stat) => (
              <StyledTableRow sx={{'&:last-child td, &:last-child th': { border: 0, margin: 0 }, '&:tr': { height: 10 } }}>
                <StyledTableCell component="th" scope="row">
                  {stat.name}
                </StyledTableCell>
                {
                  selectedHourPeriods.map((selectedHourPeriod, index) => {
                    return stat.reduceFunction ? <React.Fragment>
                        <HourStatCellWithValue reduceFunction={stat.reduceFunction} chartId={chartId} hourPeriodStr={periodLabel(selectedHourPeriod)} />
                      </React.Fragment> : <HourGeneralStat statName={stat.name} chartId={chartId} hourPeriodStr={periodLabel(selectedHourPeriod)}/>
                  })
                }
              </StyledTableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
    )
}

export default connector(HourPeriodStatsPanel)